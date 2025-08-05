import { useState } from 'react';
import { Github, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from './Modal';
import styles from './Footer.module.css';

export function Footer() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.info}>
            <Link to="/" className={styles.logo}>TagDown</Link>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} TagDown. Todos os direitos reservados.
            </p>
          </div>
          <div className={styles.links}>
            <button onClick={() => setIsTermsModalOpen(true)} className={styles.linkButton}>
              Termos de Serviço
            </button>
            <button onClick={() => setIsPrivacyModalOpen(true)} className={styles.linkButton}>
              Política de Privacidade
            </button>
          </div>
          <div className={styles.social}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter size={24} />
          </a>
          </div>
        </div>
      </footer>
      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Política de Privacidade"
      >
        <>
          <p><em>Última atualização: 02 de agosto de 2025</em></p>

          <section>
            <h2>1. Coleta de Informações</h2>
            <p>
              O TagDown coleta apenas as informações necessárias para fornecer nossos serviços:
            </p>
            <ul>
              <li>URLs inseridas para download de conteúdo</li>
              <li>Dados técnicos como endereço IP e informações do navegador</li>
              <li>Não coletamos informações pessoais identificáveis</li>
            </ul>
          </section>

          <section>
            <h2>2. Uso das Informações</h2>
            <p>As informações coletadas são utilizadas para:</p>
            <ul>
              <li>Processar suas solicitações de download</li>
              <li>Melhorar nossos serviços</li>
              <li>Prevenir uso indevido da plataforma</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2>3. Armazenamento de Dados</h2>
            <p>
              O TagDown não armazena:
            </p>
            <ul>
              <li>Histórico de downloads</li>
              <li>Arquivos baixados</li>
              <li>Informações pessoais dos usuários</li>
            </ul>
            <p>
              As URLs inseridas são processadas em tempo real e descartadas após o download ser concluído.
            </p>
          </section>

          <section>
            <h2>4. Cookies e Tecnologias Similares</h2>
            <p>
              Utilizamos cookies essenciais para:
            </p>
            <ul>
              <li>Manter a sessão do usuário</li>
              <li>Prevenir uso automatizado da plataforma</li>
              <li>Melhorar a performance do serviço</li>
            </ul>
          </section>

          <section>
            <h2>5. Compartilhamento de Dados</h2>
            <p>O TagDown não compartilha dados com terceiros, exceto:</p>
            <ul>
              <li>Quando exigido por lei</li>
              <li>Para proteger nossos direitos legais</li>
              <li>Para prevenir atividades fraudulentas</li>
            </ul>
          </section>

          <section>
            <h2>6. Seus Direitos</h2>
            <p>Você tem direito a:</p>
            <ul>
              <li>Acessar seus dados</li>
              <li>Solicitar a exclusão de dados</li>
              <li>Opor-se ao processamento</li>
              <li>Retirar seu consentimento</li>
            </ul>
          </section>

          <section>
            <h2>7. Contato</h2>
            <p>
              Para questões sobre privacidade, entre em contato através do email: <a href="mailto:privacy@tagdown.com">privacy@tagdown.com</a>
            </p>
          </section>

          <section>
            <h2>8. Atualizações da Política</h2>
            <p>
              Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas através de um aviso em nosso site.
            </p>
          </section>
        </>
      </Modal>
      <Modal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Termos de Serviço do TagDown"
      >
        <>
          <p><em>Última atualização: 02 de agosto de 2025</em></p>
          <h2>1. Introdução</h2>
          <p>
            Bem-vindo ao TagDown. Somos um serviço que facilita o download e a conversão de mídias de plataformas de redes sociais para uso pessoal. Ao utilizar nossos serviços, você concorda integralmente com os seguintes Termos de Serviço.
          </p>
          <h2>2. Uso Aceitável</h2>
          <p>
            Você pode utilizar o TagDown para:
          </p>
          <ul>
            <li>Baixar vídeos, fotos e outros conteúdos para uso estritamente pessoal e não comercial.</li>
            <li>Converter vídeos para formatos de áudio, desde que o conteúdo não seja protegido por direitos autorais.</li>
          </ul>
          <p>
            Você está proibido de:
          </p>
          <ul>
            <li>Utilizar o serviço para redistribuir, vender ou de qualquer forma comercializar conteúdo de terceiros.</li>
            <li>Baixar ou converter qualquer material que seja ilegal, pornográfico, que incite o ódio ou que seja protegido por leis de direitos autorais (DMCA).</li>
            <li>Automatizar o acesso ao serviço através de bots, scripts ou qualquer outro meio que possa sobrecarregar nossa infraestrutura.</li>
          </ul>
          <h2>3. Direitos Autorais (DMCA)</h2>
          <p>
            O TagDown atua como um intermediário e não hospeda qualquer conteúdo em seus servidores. A plataforma apenas facilita o acesso a links que já são públicos na internet.
          </p>
          <p>
            Respeitamos integralmente os direitos autorais e a propriedade intelectual. Se você acredita que algum conteúdo acessível através do nosso serviço viola seus direitos, entre em contato conosco. Para denúncias de violação, envie um "DMCA takedown request" para o e-mail: <a href="mailto:dmca@tagdown.com">dmca@tagdown.com</a>.
          </p>
          <h2>4. Limitações do Serviço</h2>
          <p>
            O TagDown é fornecido "como está". Não garantimos que o serviço estará disponível 100% do tempo, livre de erros ou compatível com todas as plataformas de mídia social. Reservamo-nos o direito de suspender ou encerrar o acesso de usuários que violem estes Termos, sem aviso prévio.
          </p>
          <h2>5. Privacidade</h2>
          <p>
            Sua privacidade é importante para nós. Coletamos apenas as URLs inseridas para processar os downloads. Não armazenamos seu histórico de downloads nem seus arquivos. Para mais detalhes, clique em "Política de Privacidade" no rodapé desta página.
          </p>
          <h2>6. Isenção de Responsabilidade</h2>
          <p>
            O TagDown não se responsabiliza por:
          </p>
          <ul>
            <li>Uso indevido do conteúdo baixado pelos usuários. A responsabilidade pelo uso do material é inteiramente sua.</li>
            <li>Quaisquer danos, perdas ou problemas causados por malware, vírus ou links de terceiros.</li>
            <li>O TagDown é um serviço independente e não possui afiliação com Instagram, TikTok ou outras plataformas mencionadas. Você é responsável pelo conteúdo que baixa.</li>
          </ul>
          <h2>7. Modificações nos Termos</h2>
          <p>
            Podemos atualizar estes Termos de Serviço periodicamente. Quando o fizermos, notificaremos os usuários através de um aviso em nosso site ou por outros meios de comunicação.
          </p>
          <h2>8. Jurisdição</h2>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa relacionada a eles será submetida à jurisdição exclusiva dos tribunais da comarca de São Paulo, SP.
          </p>
        </>
      </Modal>
    </>
  );
}
