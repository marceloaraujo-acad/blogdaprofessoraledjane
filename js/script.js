// ==========================================================================
// Homenagem — script principal
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  configurarMenuMobile();
  marcarLinkAtivo();
  configurarAnimacaoAoRolar();
  configurarLightboxGaleria();
  configurarFiltroBlog();
  configurarFormularioWhatsApp();
  configurarAnoRodape();
});

/* Abre/fecha o menu no formato mobile */
function configurarMenuMobile() {
  const botaoMenu = document.querySelector(".botao-menu");
  const menu = document.querySelector(".menu");

  if (!botaoMenu || !menu) return;

  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    botaoMenu.classList.toggle("aberto", aberto);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("aberto");
      botaoMenu.classList.remove("aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
    });
  });
}

/* Destaca no menu o link correspondente à página atual (também dentro de blog/) */
function marcarLinkAtivo() {
  const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
  const dentroDoBlog = window.location.pathname.includes("/blog/");

  document.querySelectorAll(".menu a").forEach((link) => {
    const destino = link.getAttribute("href").split("/").pop();
    if (destino === paginaAtual || (dentroDoBlog && destino === "blog.html")) {
      link.classList.add("ativo");
    }
  });
}

/* Revela elementos com a classe .fade-in conforme entram na tela */
function configurarAnimacaoAoRolar() {
  const elementos = document.querySelectorAll(".fade-in");
  if (!elementos.length) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elementos.forEach((elemento) => observador.observe(elemento));
}

/* Lightbox simples para ampliar as fotos da galeria */
function configurarLightboxGaleria() {
  const itens = document.querySelectorAll(".item-galeria[data-imagem]");
  const lightbox = document.querySelector(".lightbox");
  if (!itens.length || !lightbox) return;

  const imagemLightbox = lightbox.querySelector("img");
  const botaoFechar = lightbox.querySelector(".lightbox-fechar");

  let itemAberto = null;

  const abrirLightbox = (item) => {
    const legenda = item.getAttribute("data-legenda") || "";
    imagemLightbox.src = item.getAttribute("data-imagem");
    imagemLightbox.alt = legenda;
    lightbox.classList.add("aberto");
    itemAberto = item;
    botaoFechar?.focus();
  };

  itens.forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Ampliar foto: ${item.getAttribute("data-legenda") || ""}`);
    item.addEventListener("click", () => abrirLightbox(item));
    item.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        abrirLightbox(item);
      }
    });
  });

  const fecharLightbox = () => {
    lightbox.classList.remove("aberto");
    itemAberto?.focus();
    itemAberto = null;
  };

  botaoFechar?.addEventListener("click", fecharLightbox);
  lightbox.addEventListener("click", (evento) => {
    if (evento.target === lightbox) fecharLightbox();
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") fecharLightbox();
  });
}

/* Filtra os posts do blog por categoria (Notícias / Coluna) */
function configurarFiltroBlog() {
  const botoes = document.querySelectorAll(".filtro-blog");
  const posts = document.querySelectorAll(".post-card[data-categoria]");
  if (!botoes.length || !posts.length) return;

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoes.forEach((b) => {
        b.classList.remove("ativo");
        b.setAttribute("aria-pressed", "false");
      });
      botao.classList.add("ativo");
      botao.setAttribute("aria-pressed", "true");

      const filtro = botao.getAttribute("data-filtro");
      posts.forEach((post) => {
        const mostrar = filtro === "todos" || post.getAttribute("data-categoria") === filtro;
        post.hidden = !mostrar;
      });
    });
  });
}

/* Envia o formulário de contato para o WhatsApp com a mensagem preenchida */
function configurarFormularioWhatsApp() {
  const formulario = document.querySelector("#formulario-whatsapp");
  if (!formulario) return;

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dados = new FormData(formulario);
    const nome = String(dados.get("nome")).trim();
    const email = String(dados.get("email")).trim();
    const mensagem = String(dados.get("mensagem")).trim();

    const linhas = [`Olá! Meu nome é ${nome}.`];
    if (email) linhas.push(`E-mail: ${email}`);
    linhas.push("", mensagem);

    const numero = formulario.getAttribute("data-whatsapp");
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(linhas.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  });
}

/* Mantém o ano do rodapé sempre atualizado */
function configurarAnoRodape() {
  const spanAno = document.querySelector("#ano-atual");
  if (spanAno) {
    spanAno.textContent = new Date().getFullYear();
  }
}
