import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import type { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { fetchInstagramData } from '../services/instagramService';
import { getTikTokVideo } from '../services/tiktokService';
import { InstagramPost } from './InstagramPost';
import styles from './Hero.module.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
  const [carouselMedia, setCarouselMedia] = useState<any[]>([]);
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
    setCarouselMedia([]);
    setTiktokData(null);
    setMediaBlobUrl(null);

    try {
      const isTikTokLink = inputValue.includes('tiktok.com');
      const isInstagramLink = inputValue.includes('instagram.com');

      if (isTikTokLink) {
        const response = await getTikTokVideo(inputValue);
        if (response && response.code === 0 && response.data) {
          setTiktokData(response.data);
          handleShowMedia(response.data.hdplay || response.data.play);
        } else {
          setError(response.msg || 'Não foi possível obter os dados do vídeo do TikTok.');
        }
      } else if (isInstagramLink) {
        const postResponse = await fetchInstagramData(inputValue);
        
        // Se a resposta contém dados de um post
        if (postResponse.type === 'album' && Array.isArray(postResponse.medias)) {
          setCarouselMedia(postResponse.medias);
          setPostData(postResponse); // Armazena os dados gerais do post
          setMediaBlobUrl(null); // Limpa a mídia única
        } else if (postResponse.download_url) {
          setPostData({
            ...postResponse,
            id: postResponse.shortcode, // Usando shortcode como id
            media_type: postResponse.type,
            media_url: postResponse.download_url,
            thumbnail_src: postResponse.thumb,
          });
          handleShowMedia(postResponse.download_url);
        }
        // Se a resposta contém dados de um perfil
        else if (postResponse.Userinfo) {
          setProfileData(postResponse.Userinfo);
          // A API de perfil não retorna os posts, então limpamos os posts antigos
          setUserPosts([]);
        } else {
          setError('Não foi possível obter os dados do Instagram. Verifique o link ou nome de usuário.');
        }
      } else {
        // Trata como nome de usuário do Instagram por padrão se não for um link
        const response = await fetchInstagramData(inputValue);
        if (response.Userinfo) {
          setProfileData(response.Userinfo);
          setUserPosts([]);
        } else {
          setError('Perfil não encontrado ou privado. Verifique o nome de usuário.');
        }
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
      if (user) {
        updateRequestStatus();
      }
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
      const response = await fetch(`${BASE_URL}/proxy?url=${encodeURIComponent(mediaUrl)}`);
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

  const handleDownload = async (url: string, filename: string) => {
    setDownloadingPostId(filename); // Usa o nome do arquivo como ID de download
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/proxy?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar a mídia para download.');
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao tentar baixar a mídia.');
    } finally {
      setDownloadingPostId(null);
    }
  };

  const handlePostDownload = async (post: any) => {
    const isVideo = post.is_video;
    const downloadUrl = isVideo ? post.video_url : post.display_url;

    if (!downloadUrl) {
      setError('URL para download não encontrada.');
      return;
    }

    setDownloadingPostId(post.id);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/proxy?url=${encodeURIComponent(downloadUrl)}`);
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
      const response = await fetch(`${BASE_URL}/convert-to-audio?url=${encodeURIComponent(videoUrl)}`);
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
                  src={`${BASE_URL}/proxy?url=${encodeURIComponent(profileData.picture)}`} 
                  alt={profileData.full_name} 
                  className={styles.profilePic} 
                />
                <div className={styles.profileInfo}>
                  <h3>{profileData.full_name}</h3>
                  <p>@{profileData.username}</p>
                  <div className={styles.profileStats}>
                    <span><strong>{profileData.posts || 0}</strong> posts</span>
                    <span><strong>{(profileData.followers || 0).toLocaleString('pt-BR')}</strong> seguidores</span>
                    <span><strong>{(profileData.following || 0).toLocaleString('pt-BR')}</strong> seguindo</span>
                  </div>
                </div>
              </div>

              {userPosts && userPosts.length > 0 && (
                <div className={styles.postsGrid}>
                  {userPosts.map((post: any) => {
                    const thumbnailUrl = post.thumbnail_src || post.display_url;

                    if (!thumbnailUrl) {
                      return null;
                    }

                    return (
                      <div key={post.id} className={styles.postCard}>
                        <img 
                          src={`${BASE_URL}/proxy?url=${encodeURIComponent(thumbnailUrl)}`} 
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
              )}
            </div>
          )}

          {postData && (
            <InstagramPost 
              postData={postData} 
              profileData={profileData} 
              onDownload={handleDownload} 
            />
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
