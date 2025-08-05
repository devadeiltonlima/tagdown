import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import type { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { getProfileData, getPostDownloadLink, getPostInfo, getUserPosts } from '../services/instagramService';
import { getTikTokVideo } from '../services/tiktokService';
import styles from './Hero.module.css';

interface HeroProps {
  updateRequestStatus: () => void;
  user: User | null;
}

export interface HeroHandle {
  focusInput: () => void;
}

export const Hero = forwardRef<HeroHandle, HeroProps>(({ updateRequestStatus, user }, ref) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    },
  }));

  const [profileData, setProfileData] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [postData, setPostData] = useState<any>(null);
  const [tiktokData, setTiktokData] = useState<any>(null);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadingPostId, setDownloadingPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) {
      setError('Por favor, insira um nome de usuário ou link.');
      return;
    }

    setLoading(true);
    setError(null);
    setProfileData(null);
    setUserPosts([]);
    setPostData(null);
    setTiktokData(null);
    setMediaBlobUrl(null);

    try {
      const isTikTokLink = inputValue.includes('tiktok.com');
      const isInstagramPostLink = inputValue.includes('/p/') || inputValue.includes('/reel/');

      if (isTikTokLink) {
        const response = await getTikTokVideo(inputValue);
        if (response && response.code === 0 && response.data) {
          setTiktokData(response.data);
          handleShowMedia(response.data.hdplay || response.data.play);
        } else {
          setError(response.msg || 'Não foi possível obter os dados do vídeo do TikTok.');
        }
      } else if (isInstagramPostLink) {
        let cleanUrl = inputValue.split('?')[0];
        if (cleanUrl.endsWith('/')) {
          cleanUrl = cleanUrl.slice(0, -1);
        }

        let postResult = null;

        try {
          const dataDl = await getPostDownloadLink(cleanUrl);
          const postDl = Array.isArray(dataDl) ? dataDl.find(item => item.media_type === 'video') || dataDl[0] : dataDl;
          if (postDl && postDl.media_url) {
            postResult = { ...postDl, thumbnail_src: postDl.thumbnail_src || postDl.media_url };
          } else {
            throw new Error('Resposta inválida do /post-dl, tentando fallback.');
          }
        } catch (error) {
          console.warn('Fallback para /post ativado após falha em /post-dl:', error);
          const dataInfo = await getPostInfo(cleanUrl);
          const postInfo = Array.isArray(dataInfo) ? dataInfo[0] : dataInfo;
          if (postInfo && (postInfo.video_url || postInfo.display_url)) {
            postResult = {
              id: postInfo.id,
              media_type: postInfo.is_video ? 'video' : 'image',
              media_url: postInfo.is_video ? postInfo.video_url : postInfo.display_url,
              thumbnail_src: postInfo.thumbnail_src || postInfo.display_url,
            };
          }
        }

        if (postResult) {
          setPostData(postResult);
          if (postResult.media_type === 'video' || postResult.media_type === 'image') {
            handleShowMedia(postResult.media_url);
          }
        } else {
          setError('Não foi possível encontrar a publicação em nenhum dos endpoints.');
        }
      } else {
        const usernameMatch = inputValue.match(/(?:instagram\.com\/)([a-zA-Z0-9_.]+)/);
        const searchUsername = usernameMatch ? usernameMatch[1] : inputValue;

        const [profileResponse, postsResponse] = await Promise.all([
          getProfileData(searchUsername),
          getUserPosts(searchUsername)
        ]);

        let userProfile = null;
        if (profileResponse) {
          if (profileResponse.data && profileResponse.data.user) {
            userProfile = profileResponse.data.user;
          } else if (profileResponse.user) {
            userProfile = profileResponse.user;
          } else if (profileResponse.data && profileResponse.data.username) {
            userProfile = profileResponse.data;
          } else if (profileResponse.username) {
            userProfile = profileResponse;
          }
        }

        if (userProfile) {
          setProfileData(userProfile);
        } else {
          setError('Perfil não encontrado ou privado. Verifique o nome de usuário.');
        }

        let userPostsData = [];
        if (postsResponse) {
          // Check for the specific structure from the console log
          if (postsResponse.data && Array.isArray(postsResponse.data.items)) {
            userPostsData = postsResponse.data.items;
          } 
          // Fallbacks for other possible structures
          else if (Array.isArray(postsResponse)) {
            userPostsData = postsResponse;
          } else if (postsResponse.data && Array.isArray(postsResponse.data)) {
            userPostsData = postsResponse.data;
          } else if (postsResponse.medias && Array.isArray(postsResponse.medias)) {
            userPostsData = postsResponse.medias;
          } else if (postsResponse.items && Array.isArray(postsResponse.items)) {
            userPostsData = postsResponse.items;
          } else if (typeof postsResponse === 'object' && postsResponse !== null) {
            const arrayProperty = Object.values(postsResponse).find(value => Array.isArray(value));
            if (arrayProperty) {
              userPostsData = arrayProperty;
            }
          }
        }
        setUserPosts(userPostsData);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Too Many Requests') {
        if (user) {
          setError('Você atingiu seu limite de 20 requisições. Suas requisições serão renovadas amanhã.');
        } else {
          setError('Você atingiu o limite de requisições. Para continuar usando, por favor, faça login ou volte amanhã.');
        }
        setLimitReached(true);
      } else {
        setError('Ocorreu uma falha inesperada. Verifique o link ou nome de usuário e tente novamente.');
      }
    } finally {
      setLoading(false);
      updateRequestStatus();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
    } catch (err) {
      console.error('Falha ao ler da área de transferência:', err);
      setError('Não foi possível colar o conteúdo. Verifique as permissões do navegador.');
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  const handleShowMedia = async (mediaUrl: string) => {
    if (!mediaUrl) return;

    setIsMediaLoading(true);
    setLoadingMessage('Carregando vídeo... Isso pode levar alguns segundos.');
    setError(null);

    try {
      // Usando o nosso backend como proxy
      const response = await fetch(`http://localhost:3001/proxy?url=${encodeURIComponent(mediaUrl)}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar a mídia pelo proxy do backend.');
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setMediaBlobUrl(blobUrl);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar a mídia. Verifique se o servidor de backend está rodando.');
    } finally {
      setIsMediaLoading(false);
      setLoadingMessage('');
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePostDownload = async (post: any) => {
    const isVideo = post.is_video || post.media_type === 2 || post.media_type === 'video';
    const downloadUrl = isVideo 
      ? (post.video_versions?.[0]?.url || post.video_url)
      : (post.image_versions2?.candidates?.[0]?.url || post.display_url || post.thumbnail_url);

    if (!downloadUrl) {
      setError('URL para download não encontrada.');
      return;
    }

    setDownloadingPostId(post.id);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/proxy?url=${encodeURIComponent(downloadUrl)}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar a mídia para download.');
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const filename = `${profileData.username}_${post.id}.${isVideo ? 'mp4' : 'jpg'}`;
      handleDownload(blobUrl, filename);
      URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao tentar baixar a mídia.');
    } finally {
      setDownloadingPostId(null);
    }
  };

  const handleConvertToAudio = async (videoUrl: string, platform: 'instagram' | 'tiktok') => {
    if (!videoUrl) return;

    setIsConverting(true);
    setLoadingMessage('Convertendo para áudio... Isso pode demorar um pouco.');
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/convert-to-audio?url=${encodeURIComponent(videoUrl)}`);
      if (!response.ok) {
        throw new Error('Falha ao converter o vídeo para áudio.');
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      handleDownload(blobUrl, `${platform}_audio.mp3`);
      URL.revokeObjectURL(blobUrl); // Limpa o objeto URL
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro durante a conversão para áudio.');
    } finally {
      setIsConverting(false);
      setLoadingMessage('');
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Baixe vídeos e imagens em <strong>1 clique</strong>
          </h1>
          <p className={styles.subtitle}>
            Cole o link do perfil, post ou nome de usuário para baixar.
          </p>
          <form onSubmit={handleSearch} className={styles.form}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={limitReached ? "Limite de requisições atingido." : "Cole o link do Instagram ou TikTok aqui..."}
              className={styles.input}
              disabled={limitReached}
            />
            {inputValue ? (
              <button type="button" onClick={handleClear} className={styles.pasteButton} disabled={limitReached}>
                Limpar
              </button>
            ) : (
              <button type="button" onClick={handlePaste} className={styles.pasteButton} disabled={limitReached}>
                Colar
              </button>
            )}
            <button type="submit" disabled={loading || !termsAccepted || limitReached} className={styles.button}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
          <div className={styles.termsContainer}>
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className={styles.checkbox}
            />
            <label htmlFor="terms" className={styles.termsLabel}>
              Eu li e concordo com os <Link to="/terms" target="_blank">Termos de Serviço</Link>
            </label>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {loadingMessage && <p className={styles.loadingMessage}>{loadingMessage}</p>}
        </div>

        <div className={`${styles.resultContainer} ${profileData || postData || tiktokData ? styles.show : ''}`}>
          {profileData && (
            <div className={styles.profileSection}>
              <div className={styles.profileHeader}>
                <img 
                  src={`http://localhost:3001/proxy?url=${encodeURIComponent(profileData.profile_pic_url_hd || profileData.profile_pic_url)}`} 
                  alt={profileData.full_name} 
                  className={styles.profilePic} 
                />
                <div className={styles.profileInfo}>
                  <h3>{profileData.full_name}</h3>
                  <p>@{profileData.username}</p>
                  <div className={styles.profileStats}>
                    <span><strong>{profileData.media_count || 0}</strong> posts</span>
                    <span><strong>{(profileData.follower_count || profileData.followers || 0).toLocaleString('pt-BR')}</strong> seguidores</span>
                    <span><strong>{(profileData.following_count || profileData.following || 0).toLocaleString('pt-BR')}</strong> seguindo</span>
                  </div>
                </div>
              </div>

              <div className={styles.postsGrid}>
                {userPosts.map((post: any) => {
                  const thumbnailUrl = post.thumbnail_url 
                                    || post.image_versions2?.candidates?.[0]?.url 
                                    || post.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url 
                                    || post.display_url;

                  if (!thumbnailUrl) {
                    return null;
                  }

                  return (
                    <div key={post.id} className={styles.postCard}>
                      <img 
                        src={`http://localhost:3001/proxy?url=${encodeURIComponent(thumbnailUrl)}`} 
                        alt={`Post by ${profileData.username}`} 
                        className={styles.postImage} 
                      />
                      <div className={styles.postOverlay}>
                        <button
                          onClick={() => handlePostDownload(post)}
                          disabled={downloadingPostId === post.id}
                          className={styles.downloadButton}
                        >
                          {downloadingPostId === post.id ? 'Baixando...' : 'Baixar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {postData && mediaBlobUrl && (
            <div className={styles.postSection}>
              {postData.media_type === 'video' ? (
                <video controls autoPlay src={mediaBlobUrl} className={styles.singleMedia}></video>
              ) : (
                <img src={mediaBlobUrl} alt="Instagram Post" className={styles.singleMedia} />
              )}
              <div className={styles.buttonGroup}>
                <button 
                  onClick={() => handleDownload(mediaBlobUrl, `post_${postData.id}.${postData.media_type === 'video' ? 'mp4' : 'jpg'}`)}
                  className={`${styles.downloadButton} ${styles.singleDownloadButton}`}
                >
                  Baixar Mídia
                </button>
                {postData.media_type === 'video' && (
                  <button
                    onClick={() => handleConvertToAudio(postData.media_url, 'instagram')}
                    disabled={isConverting || isMediaLoading}
                    className={`${styles.downloadButton} ${styles.singleDownloadButton} ${styles.convertButton}`}
                  >
                    {isConverting ? 'Convertendo...' : 'Extrair Áudio (MP3)'}
                  </button>
                )}
              </div>
            </div>
          )}

          {tiktokData && mediaBlobUrl && (
            <div className={styles.postSection}>
              <video controls autoPlay src={mediaBlobUrl} className={styles.singleMedia}></video>
              <div className={styles.buttonGroup}>
                <button 
                  onClick={() => handleDownload(mediaBlobUrl, `tiktok_${tiktokData.id}.mp4`)}
                  className={`${styles.downloadButton} ${styles.singleDownloadButton}`}
                >
                  Baixar Vídeo
                </button>
                <button
                  onClick={() => handleConvertToAudio(tiktokData.hdplay || tiktokData.play, 'tiktok')}
                  disabled={isConverting || isMediaLoading}
                  className={`${styles.downloadButton} ${styles.singleDownloadButton} ${styles.convertButton}`}
                >
                  {isConverting ? 'Convertendo...' : 'Extrair Áudio (MP3)'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
