import styles from './PrivacyPolicy.module.css';

export function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Política de Privacidade</h1>
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
      </div>
    </div>
  );
}
