import { useState, useMemo } from 'react';
import styles from './InstagramPost.module.css';
import { Download, Heart, MessageCircle, Send, Copy } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface Media {
  type: 'image' | 'video';
  download_url: string;
}

interface PostData {
  caption: string;
  type: 'image' | 'video' | 'album';
  media_url?: string;
  medias?: Media[];
  shortcode: string;
}

interface ProfileData {
  username: string;
  picture: string;
}

interface InstagramPostProps {
  postData: PostData;
  profileData?: ProfileData; // Perfil pode não estar disponível para posts únicos
  onDownload: (url: string, filename: string) => void;
}

export const InstagramPost = ({ postData, profileData, onDownload }: InstagramPostProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copyText, setCopyText] = useState('Copiar');
  const medias = postData.type === 'album' ? postData.medias || [] : [{ type: postData.type, download_url: postData.media_url || '' }];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === medias.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? medias.length - 1 : prev - 1));
  };

  const handleDownloadClick = () => {
    const media = medias[currentSlide];
    const filename = `${profileData?.username || 'instagram'}_${postData.shortcode}_${currentSlide + 1}.${media.type === 'video' ? 'mp4' : 'jpg'}`;
    onDownload(media.download_url, filename);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(postData.caption).then(() => {
      setCopyText('Copiado!');
      setTimeout(() => setCopyText('Copiar'), 2000);
    });
  };

  const { mainCaption, hashtags } = useMemo(() => {
    const hashtagRegex = /(#[\w\d_]+)/g;
    const foundHashtags = postData.caption.match(hashtagRegex) || [];
    const cleanCaption = postData.caption.replace(hashtagRegex, '').trim();
    return { mainCaption: cleanCaption, hashtags: foundHashtags };
  }, [postData.caption]);

  return (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        {profileData && (
          <>
            <img src={`${BASE_URL}/proxy?url=${encodeURIComponent(profileData.picture)}`} alt={profileData.username} className={styles.profilePic} />
            <strong>{profileData.username}</strong>
          </>
        )}
      </div>

      <div className={styles.mediaContainer}>
        {medias.length > 1 && <button onClick={prevSlide} className={`${styles.navButton} ${styles.prev}`}>&#10094;</button>}
        <div className={styles.mediaSlider} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {medias.map((media, index) => (
            <div key={index} className={styles.mediaItem}>
              {media.type === 'video' ? (
                <video controls src={`${BASE_URL}/proxy?url=${encodeURIComponent(media.download_url)}`} className={styles.media}></video>
              ) : (
                <img src={`${BASE_URL}/proxy?url=${encodeURIComponent(media.download_url)}`} alt={`Post media ${index + 1}`} className={styles.media} />
              )}
            </div>
          ))}
        </div>
        {medias.length > 1 && <button onClick={nextSlide} className={`${styles.navButton} ${styles.next}`}>&#10095;</button>}
      </div>

      <div className={styles.postActions}>
        <div className={styles.leftActions}>
          <Heart size={24} />
          <MessageCircle size={24} />
          <Send size={24} />
        </div>
        <div className={styles.rightActions}>
          <Download size={24} onClick={handleDownloadClick} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <div className={styles.captionContainer}>
        <div className={styles.postCaption}>
          {profileData && <strong>{profileData.username}</strong>}
          <p>{mainCaption}</p>
        </div>
        {hashtags.length > 0 && (
          <div className={styles.hashtagsContainer}>
            {hashtags.map((tag, index) => (
              <span key={index} className={styles.hashtag}>{tag}</span>
            ))}
          </div>
        )}
        <button onClick={handleCopyCaption} className={styles.copyButton}>
          <Copy size={16} /> {copyText}
        </button>
      </div>
    </div>
  );
};
