import styles from './HowItWorks.module.css';

interface HowItWorksProps {
  onExperimentClick: () => void;
}

export function HowItWorks({ onExperimentClick }: HowItWorksProps) {
  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.title}>Como Funciona?</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Cole o Link</h3>
            <p className={styles.stepDescription}>Copie o link do vídeo ou imagem que deseja baixar.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Escolha o Formato</h3>
            <p className={styles.stepDescription}>Selecione se deseja baixar como MP4, JPG ou converter para MP3.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Baixe</h3>
            <p className={styles.stepDescription}>Clique no botão e o download começará instantaneamente.</p>
          </div>
        </div>
        <button onClick={onExperimentClick} className={styles.ctaButton}>
          Comece a usar agora
        </button>
      </div>
    </section>
  );
}
