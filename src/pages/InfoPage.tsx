import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../hooks/useSeo';

type Kind = 'sobre' | 'privacidade' | 'condicoes';

const defaults: Record<Exclude<Kind, 'sobre'>, string> = {
  privacidade: `## Quais dados coletamos
Ao enviar um pedido, registramos o nome informado, as observações e os itens escolhidos. A conversa continua no WhatsApp, que possui política de privacidade própria.

## Para que usamos
Os dados são usados apenas para atender e confirmar o seu pedido. Não vendemos nem compartilhamos suas informações com terceiros para fins de marketing.

## Armazenamento no navegador
O carrinho de compras fica salvo no seu próprio navegador para que você não perca os itens escolhidos. Você pode limpá-lo a qualquer momento.

## Seus direitos
Você pode solicitar a consulta, correção ou exclusão dos seus dados pelos nossos canais de atendimento, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).

(Texto-base: revise e ajuste no painel administrativo antes de publicar.)`,
  condicoes: `## Como funciona o pedido
O site é um catálogo. Ao finalizar o carrinho, o pedido é registrado e enviado pelo WhatsApp. Nenhum pagamento é processado pelo site.

## Confirmação
Todo pedido é confirmado pela nossa equipe, que verifica disponibilidade em estoque, valor final, forma de pagamento e entrega. Preços e estoque exibidos podem mudar até a confirmação.

## Pagamento e entrega
As formas de pagamento, prazos e valores de entrega são informados no atendimento pelo WhatsApp.

## Trocas e devoluções
Consulte nossa equipe sobre condições de troca. Compras realizadas fora do estabelecimento seguem o direito de arrependimento previsto no Código de Defesa do Consumidor (art. 49).

(Texto-base: revise e ajuste no painel administrativo antes de publicar.)`,
};

/** Converte texto simples (## títulos, parágrafos separados por linha em branco, "- " listas). */
export function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="prose-rl">
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        return (
          <div key={i}>
            {lines.map((line, j) =>
              line.startsWith('## ') ? <h2 key={j}>{line.slice(3)}</h2> : line.startsWith('- ') ? null : <p key={j}>{line}</p>,
            )}
            {lines.some((l) => l.startsWith('- ')) && (
              <ul>{lines.filter((l) => l.startsWith('- ')).map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function InfoPage({ kind }: { kind: Kind }) {
  const { settings } = useStore();
  const config = {
    sobre: { title: settings.about_title || 'Sobre nós', text: settings.about_text || 'Edite este texto no painel administrativo, em Configurações.' },
    privacidade: { title: 'Política de privacidade', text: settings.privacy_text || defaults.privacidade },
    condicoes: { title: 'Condições de compra', text: settings.terms_text || defaults.condicoes },
  }[kind];
  useSeo({ title: config.title, description: `${config.title} — ${settings.store_name}.` });

  return (
    <div className="container-page max-w-3xl py-12">
      <nav aria-label="Trilha" className="text-xs text-cream/60">
        <Link to="/" className="hover:text-gold-light">Início</Link> <span aria-hidden>/</span> <span aria-current="page">{config.title}</span>
      </nav>
      <h1 className="section-title mt-4">{config.title}</h1>
      <div className="mt-3 h-px w-16 bg-gold-gradient" />
      <div className="mt-8">
        <RichText text={config.text} />
      </div>
    </div>
  );
}
