import { Image, Video, Headphones } from 'lucide-react';
import styles from './Features.module.css';

const featuresData = [
  {
    icon: <Image size={48} color="#00B375" />,
    title: 'Instagram Downloader',
    description: 'Baixe fotos, vídeos, stories e reels do Instagram com um único clique.',
  },
  {
    icon: <Video size={48} color="#00B375" />,
    title: 'TikTok Downloader',
    description: 'Salve vídeos do TikTok sem marca d\'água, de forma rápida e fácil.',
  },
  {
    icon: <Headphones size={48} color="#00B375" />,
    title: 'Conversor para MP3',
    description: 'Extraia o áudio de qualquer vídeo e salve no formato MP3 de alta qualidade.',
  },
];

interface FeaturesProps {
  onExperimentClick: () => void;
}

export function Features({ onExperimentClick }: FeaturesProps) {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.title}>Recursos Principais</h2>
        <div className={styles.grid}>
          {featuresData.map((feature, index) => (
            <div key={index} className={styles.card}>
              {feature.icon}
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
              <button onClick={onExperimentClick} className={styles.cardButton}>
                Experimente
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
