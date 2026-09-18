// ================================================================
// LANDING PAGES PERSONALIZADAS DOS LEADS (JIT - JUST IN TIME)
// Portal do Cliente sob Login (E-mail) e Senha (CNPJ)
// ================================================================

// Template padrão oficial MiCRO Automação (Válvula de Sopro PET)
const TEMPLATE_PADRAO_SOPRO_PET = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Válvula de Sopro PET | MiCRO Automação - Proposta Exclusiva {{empresa}}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --micro-blue: #0057a8;
            --micro-blue-dark: #003d75;
            --micro-orange: #f26522;
            --micro-orange-light: #ff7a33;
            --micro-black: #1a1a1a;
            --micro-dark: #2d2d2d;
            --micro-gray: #6b6b6b;
            --micro-light: #f5f5f5;
            --micro-white: #ffffff;
            --success: #28a745;
        }
        body {
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            color: var(--micro-dark);
            overflow-x: hidden;
            background: #fff;
        }
        h1, h2, h3, h4, h5 { font-family: 'Montserrat', sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        .navbar {
            background: var(--micro-white);
            padding: 15px 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
            border-bottom: 3px solid var(--micro-orange);
        }
        .navbar .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo-micro {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }
        .logo-blue {
            background: var(--micro-blue);
            color: white;
            padding: 8px 18px;
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            font-size: 1.6em;
            letter-spacing: 2px;
            border-radius: 4px;
        }
        .logo-blue span {
            font-weight: 400;
            font-size: 0.5em;
            display: block;
            letter-spacing: 3px;
            text-transform: lowercase;
        }
        .nav-cta {
            background: var(--micro-orange);
            color: white;
            padding: 12px 28px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.9em;
            transition: all 0.3s;
            font-family: 'Montserrat', sans-serif;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .nav-cta:hover {
            background: var(--micro-orange-light);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(242, 101, 34, 0.4);
        }
        
        .hero {
            background: linear-gradient(135deg, var(--micro-black) 0%, var(--micro-dark) 100%);
            color: white;
            padding: 140px 0 80px;
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                radial-gradient(circle at 20% 50%, rgba(0, 87, 168, 0.35) 0%, transparent 50%),
                radial-gradient(circle at 80% 50%, rgba(242, 101, 34, 0.25) 0%, transparent 50%);
        }
        .hero-content {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 50px;
            align-items: center;
            position: relative;
            z-index: 1;
        }
        .hero-text .badge-exclusive {
            display: inline-block;
            background: var(--micro-orange);
            color: white;
            padding: 8px 20px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 0.85em;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 25px;
            font-family: 'Montserrat', sans-serif;
            box-shadow: 0 4px 12px rgba(242, 101, 34, 0.3);
        }
        .hero h1 {
            font-size: 3em;
            font-weight: 900;
            line-height: 1.15;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .hero h1 .highlight-orange { color: var(--micro-orange); display: block; }
        .hero h1 .highlight-blue {
            color: var(--micro-blue);
            background: white;
            padding: 4px 16px;
            display: inline-block;
            border-radius: 4px;
            font-size: 0.7em;
            letter-spacing: 1px;
            vertical-align: middle;
            margin-top: 6px;
        }
        .hero .subtitle {
            font-size: 1.25em;
            margin-bottom: 30px;
            opacity: 0.95;
            font-weight: 300;
            line-height: 1.5;
        }
        .hero-benefits {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 35px;
        }
        .hero-benefit {
            background: rgba(255,255,255,0.12);
            padding: 10px 18px;
            border-radius: 4px;
            font-size: 0.9em;
            border-left: 3px solid var(--micro-orange);
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
        }
        .hero-buttons { display: flex; gap: 15px; flex-wrap: wrap; }
        .cta-button {
            display: inline-block;
            background: var(--micro-orange);
            color: white;
            padding: 16px 32px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.95em;
            transition: all 0.3s;
            font-family: 'Montserrat', sans-serif;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: none;
            cursor: pointer;
            text-align: center;
        }
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 25px rgba(242, 101, 34, 0.45);
            background: var(--micro-orange-light);
        }
        .cta-button.blue { background: var(--micro-blue); }
        .cta-button.blue:hover {
            background: var(--micro-blue-dark);
            box-shadow: 0 6px 25px rgba(0, 87, 168, 0.45);
        }
        .cta-button.outline {
            background: transparent;
            border: 2px solid white;
        }
        .cta-button.outline:hover {
            background: white;
            color: var(--micro-black);
        }
        .hero-image {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .valve-card-showcase {
            width: 100%;
            background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            text-align: center;
        }
        .valve-svg-wrap {
            width: 100%;
            max-width: 320px;
            margin: 0 auto 15px;
        }
        .badge-nacional {
            position: absolute;
            top: -15px;
            left: -15px;
            background: var(--micro-orange);
            color: white;
            width: 95px;
            height: 95px;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 0.72em;
            text-transform: uppercase;
            font-family: 'Montserrat', sans-serif;
            box-shadow: 0 5px 20px rgba(242, 101, 34, 0.5);
            animation: pulse 2s infinite;
            text-align: center;
            line-height: 1.2;
            z-index: 2;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
        }
        .badge-nacional span { font-size: 1.35em; }
        
        .social-proof {
            background: var(--micro-blue);
            color: white;
            padding: 36px 0;
        }
        .social-proof-content {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-wrap: wrap;
            gap: 25px;
        }
        .proof-item { text-align: center; }
        .proof-number {
            font-size: 2.8em;
            font-weight: 900;
            color: var(--micro-orange);
            font-family: 'Montserrat', sans-serif;
            line-height: 1;
        }
        .proof-label {
            font-size: 0.85em;
            opacity: 0.95;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 5px;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
        }
        
        .problem { padding: 80px 0; background: var(--micro-light); }
        .section-header { text-align: center; margin-bottom: 50px; }
        .section-header .tag {
            display: inline-block;
            background: var(--micro-orange);
            color: white;
            padding: 6px 18px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
            font-family: 'Montserrat', sans-serif;
        }
        .section-header h2 {
            font-size: 2.4em;
            color: var(--micro-black);
            margin-bottom: 12px;
            text-transform: uppercase;
        }
        .section-header p {
            font-size: 1.15em;
            color: var(--micro-gray);
            max-width: 700px;
            margin: 0 auto;
        }
        .problem-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
        }
        .problem-card {
            background: white;
            padding: 35px 30px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.06);
            border-top: 4px solid var(--micro-orange);
            transition: transform 0.3s;
        }
        .problem-card:hover { transform: translateY(-6px); }
        .problem-card .icon { font-size: 2.5em; margin-bottom: 15px; }
        .problem-card h3 {
            color: var(--micro-black);
            margin-bottom: 10px;
            font-size: 1.25em;
            text-transform: uppercase;
        }
        
        .solution { padding: 80px 0; background: white; }
        .solution-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }
        .solution-text h2 {
            font-size: 2.3em;
            color: var(--micro-black);
            margin-bottom: 18px;
            text-transform: uppercase;
        }
        .solution-text h2 span { color: var(--micro-orange); }
        .solution-text .lead {
            font-size: 1.1em;
            color: var(--micro-gray);
            margin-bottom: 25px;
        }
        .feature-list { list-style: none; }
        .feature-list li {
            padding: 12px 0;
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 1.05em;
            border-bottom: 1px solid #eee;
        }
        .feature-list li:last-child { border-bottom: none; }
        .feature-list .check {
            background: var(--micro-blue);
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9em;
        }
        
        .compatibility {
            padding: 80px 0;
            background: var(--micro-black);
            color: white;
        }
        .compatibility-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            align-items: center;
        }
        .compatibility-box {
            background: rgba(255,255,255,0.05);
            border: 2px solid var(--micro-orange);
            border-radius: 8px;
            padding: 30px;
            text-align: center;
        }
        .compatibility-text h3 {
            font-size: 2.1em;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .compatibility-text h3 span { color: var(--micro-orange); }
        .compatibility-text p {
            font-size: 1.1em;
            margin-bottom: 18px;
            opacity: 0.92;
            line-height: 1.7;
        }
        .norgren-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.1);
            padding: 10px 18px;
            border-radius: 4px;
            font-weight: 600;
            margin: 5px 6px 5px 0;
            border: 1px solid rgba(255,255,255,0.2);
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9em;
        }
        .norgren-badge .dot { width: 8px; height: 8px; background: var(--success); border-radius: 50%; }
        
        .advantages { padding: 80px 0; background: var(--micro-light); }
        .advantages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
        }
        .advantage-card {
            background: white;
            padding: 35px 25px;
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.06);
            text-align: center;
            transition: all 0.3s;
            border-bottom: 4px solid transparent;
        }
        .advantage-card:hover {
            transform: translateY(-6px);
            border-bottom-color: var(--micro-orange);
            box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        }
        .advantage-icon { font-size: 2.8em; margin-bottom: 15px; }
        .advantage-card h3 {
            color: var(--micro-black);
            margin-bottom: 12px;
            font-size: 1.25em;
            text-transform: uppercase;
        }
        .advantage-card p { color: var(--micro-gray); line-height: 1.65; }
        .advantage-tag {
            display: inline-block;
            background: var(--micro-blue);
            color: white;
            padding: 6px 14px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 0.78em;
            margin-top: 15px;
            font-family: 'Montserrat', sans-serif;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .price-card {
            background: linear-gradient(135deg, var(--micro-orange), var(--micro-orange-light));
            color: white;
        }
        .price-card h3 { color: white; }
        .price-card p { color: rgba(255,255,255,0.95); }
        .price-tag {
            display: inline-block;
            background: white;
            color: var(--micro-orange);
            padding: 6px 16px;
            border-radius: 4px;
            font-weight: 800;
            font-size: 0.9em;
            margin-top: 15px;
            font-family: 'Montserrat', sans-serif;
        }
        
        /* SEÇÃO ITENS / PROPOSTA PERSONALIZADA (JIT) */
        .proposta-itens-section {
            padding: 70px 0;
            background: #fff;
            border-top: 1px solid #eaeaea;
        }
        .proposta-box {
            background: #fafafa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .itens-tabela-custom {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 0.95em;
        }
        .itens-tabela-custom th {
            background: var(--micro-blue);
            color: white;
            text-align: left;
            padding: 12px 16px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.85em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .itens-tabela-custom td {
            padding: 12px 16px;
            border-bottom: 1px solid #e5e5e5;
            color: #333;
        }
        .itens-tabela-custom tr:nth-child(even) { background: #fdfdfd; }
        
        .personal-message {
            background: var(--micro-light);
            padding: 60px 0;
            border-top: 4px solid var(--micro-orange);
            border-bottom: 4px solid var(--micro-orange);
        }
        .personal-message .container { max-width: 850px; }
        .message-box {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border-left: 5px solid var(--micro-blue);
        }
        .message-box h3 {
            color: var(--micro-black);
            font-size: 1.45em;
            margin-bottom: 15px;
            text-transform: uppercase;
        }
        .message-box p {
            font-size: 1.08em;
            color: var(--micro-gray);
            line-height: 1.75;
            margin-bottom: 15px;
        }
        .message-box .signature {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-family: 'Montserrat', sans-serif;
        }
        .message-box .signature strong { color: var(--micro-blue); font-size: 1.15em; }
        .message-box .signature .role { color: var(--micro-gray); font-size: 0.9em; line-height: 1.5; display: block; }
        
        .cta-final {
            padding: 90px 0;
            background: linear-gradient(135deg, var(--micro-blue) 0%, var(--micro-blue-dark) 100%);
            color: white;
            text-align: center;
            position: relative;
        }
        .cta-final h2 {
            font-size: 2.6em;
            margin-bottom: 15px;
            font-weight: 900;
            text-transform: uppercase;
        }
        .cta-final h2 span { color: var(--micro-orange); }
        .cta-final .subtitle {
            font-size: 1.25em;
            margin-bottom: 30px;
            opacity: 0.95;
        }
        .urgency-box {
            background: var(--micro-orange);
            color: white;
            padding: 14px 35px;
            border-radius: 4px;
            display: inline-block;
            margin: 15px 0 25px;
            font-weight: 700;
            font-size: 1em;
            font-family: 'Montserrat', sans-serif;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .cta-buttons-final {
            display: flex;
            gap: 18px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        .guarantee {
            margin-top: 35px;
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }
        .guarantee-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9em;
            opacity: 0.9;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
        }
        .guarantee-item .check { color: var(--micro-orange); font-size: 1.2em; font-weight: bold; }
        
        footer {
            background: var(--micro-black);
            color: white;
            padding: 50px 0 25px;
        }
        .footer-content {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 40px;
            margin-bottom: 35px;
        }
        .footer-brand .logo-blue { display: inline-block; margin-bottom: 15px; }
        .footer-brand p { opacity: 0.8; font-size: 0.92em; line-height: 1.7; }
        .footer-links h4 {
            margin-bottom: 15px;
            color: var(--micro-orange);
            text-transform: uppercase;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.95em;
            letter-spacing: 1px;
        }
        .footer-links ul { list-style: none; }
        .footer-links li { padding: 6px 0; }
        .footer-links a { color: white; text-decoration: none; opacity: 0.8; font-size: 0.9em; transition: opacity 0.2s; }
        .footer-links a:hover { opacity: 1; color: var(--micro-orange); }
        .footer-bottom {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 25px;
            text-align: center;
            opacity: 0.7;
            font-size: 0.82em;
        }
        
        @media (max-width: 868px) {
            .hero-content, .solution-content, .compatibility-content, .footer-content { grid-template-columns: 1fr; }
            .hero h1 { font-size: 2.2em; }
            .hero { padding: 110px 0 60px; }
            .badge-nacional { width: 75px; height: 75px; font-size: 0.6em; }
        }
    </style>
</head>
<body>

    <!-- NAVBAR -->
    <nav class="navbar">
        <div class="container">
            <div class="logo-micro">
                <div class="logo-blue">
                    MiCRO
                    <span>automação</span>
                </div>
            </div>
            <a href="#proposta" class="nav-cta">Solicitar Proposta</a>
        </div>
    </nav>

    <!-- HERO SECTION -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <span class="badge-exclusive">🎯 Proposta Exclusiva para {{empresa}}</span>
                    <h1>
                        NOVA VÁLVULA DE
                        <span class="highlight-orange">SOPRO PET</span>
                        <span class="highlight-blue">Produto Nacional</span>
                    </h1>
                    <p class="subtitle">
                        Manutenção simples e de <strong>baixo custo</strong> dos reparos. 
                        Tecnologia validada com foco em praticidade, custo e tempo de manutenção.
                    </p>
                    <div class="hero-benefits">
                        <span class="hero-benefit">✓ Fácil Instalação</span>
                        <span class="hero-benefit">✓ Alta Vazão</span>
                        <span class="hero-benefit">✓ 1W Consumo</span>
                        <span class="hero-benefit">✓ Preço Imbatível</span>
                    </div>
                    <div class="hero-buttons">
                        <a href="#proposta" class="cta-button">QUERO UMA PROPOSTA</a>
                        <a href="https://wa.me/{{vendedor_whatsapp_digits}}?text=Ol%C3%A1%20{{vendedor_nome}},%20sou%20da%20{{empresa}}%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20v%C3%A1lvulas%20de%20sopro%20PET." class="cta-button outline" target="_blank">FALAR COM {{vendedor_nome}}</a>
                    </div>
                </div>
                <div class="hero-image">
                    <div class="valve-card-showcase">
                        <div class="valve-svg-wrap">
                            <!-- SVG de Alta Definição da Válvula Industrial MiCRO -->
                            <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;filter:drop-shadow(0 15px 25px rgba(0,0,0,0.5));">
                                <rect x="70" y="70" width="180" height="150" rx="14" fill="#2d3748" stroke="#4a5568" stroke-width="4"/>
                                <rect x="95" y="40" width="130" height="35" rx="6" fill="#0057a8" stroke="#003d75" stroke-width="3"/>
                                <rect x="135" y="15" width="50" height="28" rx="4" fill="#f26522"/>
                                <circle cx="160" cy="29" r="6" fill="#ffffff"/>
                                <rect x="90" y="95" width="140" height="100" rx="8" fill="#1a202c"/>
                                <text x="160" y="135" fill="#f26522" font-family="Montserrat, sans-serif" font-weight="900" font-size="15" text-anchor="middle" letter-spacing="2">MiCRO PET</text>
                                <text x="160" y="155" fill="#ffffff" font-family="Roboto, sans-serif" font-weight="500" font-size="11" text-anchor="middle">SOPRO HIGH-FLOW 40 BAR</text>
                                <circle cx="160" cy="175" r="7" fill="#28a745"/>
                                <rect x="30" y="125" width="45" height="40" rx="6" fill="#718096" stroke="#4a5568" stroke-width="3"/>
                                <rect x="245" y="125" width="45" height="40" rx="6" fill="#718096" stroke="#4a5568" stroke-width="3"/>
                                <rect x="120" y="215" width="80" height="35" rx="6" fill="#4a5568"/>
                                <circle cx="140" cy="232" r="6" fill="#cbd5e0"/>
                                <circle cx="180" cy="232" r="6" fill="#cbd5e0"/>
                            </svg>
                        </div>
                        <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:1.05em;color:#fff;">Válvula de Sopro PET MiCRO</div>
                        <div style="font-size:0.85em;color:#cbd5e0;margin-top:4px;">Alta vazão • Baixo consumo 1W • Compatibilidade Norgren</div>
                    </div>
                    <div class="badge-nacional">
                        <span>PRODUTO</span>
                        NACIONAL
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SOCIAL PROOF BAR -->
    <section class="social-proof">
        <div class="container">
            <div class="social-proof-content">
                <div class="proof-item">
                    <div class="proof-number">60%</div>
                    <div class="proof-label">Menos Manutenção</div>
                </div>
                <div class="proof-item">
                    <div class="proof-number">+50</div>
                    <div class="proof-label">Plantas Equipadas</div>
                </div>
                <div class="proof-item">
                    <div class="proof-number">24h</div>
                    <div class="proof-label">Peças de Reposição</div>
                </div>
                <div class="proof-item">
                    <div class="proof-number">100%</div>
                    <div class="proof-label">Compatível Norgren</div>
                </div>
            </div>
        </div>
    </section>

    <!-- PROBLEM SECTION -->
    <section class="problem">
        <div class="container">
            <div class="section-header">
                <span class="tag">Diagnóstico</span>
                <h2>Sua operação enfrenta esses desafios?</h2>
                <p>Se você usa válvulas de sopro convencionais, provavelmente já lidou com:</p>
            </div>
            <div class="problem-grid">
                <div class="problem-card">
                    <div class="icon">⏱️</div>
                    <h3>Tempo de Parada Elevado</h3>
                    <p>Manutenções complexas que param sua produção por horas, gerando prejuízo e atrasos na entrega.</p>
                </div>
                <div class="problem-card">
                    <div class="icon">💸</div>
                    <h3>Custo de Reposição Alto</h3>
                    <p>Peças importadas com preços elevados e lead time longo, impactando seu orçamento operacional.</p>
                </div>
                <div class="problem-card">
                    <div class="icon">⚙️</div>
                    <h3>Complexidade na Troca</h3>
                    <p>Instalações complicadas que exigem mão de obra especializada e tempo precioso da equipe.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SOLUTION SECTION -->
    <section class="solution">
        <div class="container">
            <div class="solution-content">
                <div class="solution-text">
                    <h2>A Solução Definitiva para <span>Sua Linha PET</span></h2>
                    <p class="lead">
                        Nossa válvula de sopro PET foi desenvolvida com foco em <strong>praticidade, custo e tempo de manutenção</strong>. 
                        Tecnologia validada em diversas plantas industriais, funcionando em conjunto com Norgren.
                    </p>
                    <ul class="feature-list">
                        <li>
                            <span class="check">✓</span>
                            <span><strong>Fácil Instalação</strong> - Plug and play, sem complicações</span>
                        </li>
                        <li>
                            <span class="check">✓</span>
                            <span><strong>Construção Robusta</strong> - Durabilidade comprovada em campo</span>
                        </li>
                        <li>
                            <span class="check">✓</span>
                            <span><strong>Alta Capacidade de Vazão</strong> - Performance superior</span>
                        </li>
                        <li>
                            <span class="check">✓</span>
                            <span><strong>Alta Eficiência e Repetibilidade</strong> - Qualidade constante</span>
                        </li>
                        <li>
                            <span class="check">✓</span>
                            <span><strong>Excelente Tempo de Resposta</strong> - Precisão em cada ciclo</span>
                        </li>
                        <li>
                            <span class="check">✓</span>
                            <span><strong>Sistema por Despressurização</strong> - Tecnologia avançada</span>
                        </li>
                        <li>
                            <span class="check">✓</span>
                            <span><strong>Baixo Consumo (1W)</strong> - Economia de energia contínua</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <div style="background:#f8f9fa;border:1px solid #e2e8f0;border-radius:12px;padding:35px;box-shadow:0 10px 30px rgba(0,0,0,0.06);">
                        <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:1.4em;color:var(--micro-blue);margin-bottom:15px;text-transform:uppercase;">
                            Destaques Técnicos MiCRO
                        </div>
                        <p style="color:var(--micro-gray);margin-bottom:20px;">
                            Projetada para suportar a cadência agressiva das sopradoras industriais rotativas e lineares mais exigentes do Brasil.
                        </p>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                            <div style="background:#fff;padding:15px;border-radius:6px;border-left:4px solid var(--micro-blue);">
                                <div style="font-size:0.8em;color:#888;text-transform:uppercase;font-weight:700;">Pressão de Trabalho</div>
                                <strong style="color:var(--micro-dark);font-size:1.1em;">Até 40 Bar</strong>
                            </div>
                            <div style="background:#fff;padding:15px;border-radius:6px;border-left:4px solid var(--micro-orange);">
                                <div style="font-size:0.8em;color:#888;text-transform:uppercase;font-weight:700;">Consumo Elétrico</div>
                                <strong style="color:var(--micro-dark);font-size:1.1em;">Apenas 1W</strong>
                            </div>
                            <div style="background:#fff;padding:15px;border-radius:6px;border-left:4px solid var(--success);">
                                <div style="font-size:0.8em;color:#888;text-transform:uppercase;font-weight:700;">Manutenção</div>
                                <strong style="color:var(--micro-dark);font-size:1.1em;">Reparo Fácil</strong>
                            </div>
                            <div style="background:#fff;padding:15px;border-radius:6px;border-left:4px solid var(--micro-blue);">
                                <div style="font-size:0.8em;color:#888;text-transform:uppercase;font-weight:700;">Garantia & Suporte</div>
                                <strong style="color:var(--micro-dark);font-size:1.1em;">Nacional Direto</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- COMPATIBILITY SECTION -->
    <section class="compatibility">
        <div class="container">
            <div class="section-header">
                <span class="tag" style="background: var(--micro-blue);">Compatibilidade</span>
                <h2 style="color:#fff;">Funciona com Seu Parque Atual</h2>
                <p style="color:rgba(255,255,255,0.85);">Instalada e operando em conjunto com sistemas Norgren em diversas plantas</p>
            </div>
            <div class="compatibility-content">
                <div class="compatibility-box">
                    <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:1.8em;color:var(--micro-orange);margin-bottom:12px;">
                        100% PLUG & PLAY
                    </div>
                    <p style="opacity:0.9;font-size:1.05em;margin-bottom:20px;">
                        Substituição direta sem necessidade de adaptações estruturais ou alterações mecânicas no bloco de sopro.
                    </p>
                    <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
                        <span class="norgren-badge"><span class="dot"></span> Compatível Norgren</span>
                        <span class="norgren-badge"><span class="dot"></span> Plug & Play</span>
                        <span class="norgren-badge"><span class="dot"></span> Sem Adaptações</span>
                    </div>
                </div>
                <div class="compatibility-text">
                    <h3>{{decisor}}, <span>Já Estamos na Sua Planta!</span></h3>
                    <p>
                        Acreditamos que a <strong>{{empresa}}</strong> já possui ou tem total afinidade com a tecnologia das nossas válvulas em operação, 
                        inclusive funcionando em conjunto com sistemas <strong>Norgren</strong>.
                    </p>
                    <p>
                        Que tal expandir essa tecnologia para toda a sua linha de produção e 
                        colher os benefícios em escala? Preço realmente imbatível pelo que entregamos.
                    </p>
                    <a href="#proposta" class="cta-button" style="margin-top: 15px;">
                        EXPANDIR PARA TODA LINHA
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- ADVANTAGES SECTION -->
    <section class="advantages">
        <div class="container">
            <div class="section-header">
                <span class="tag">Diferenciais</span>
                <h2>Vantagens Competitivas Reais</h2>
                <p>Não é só discurso. São resultados que impactam seu bottom line:</p>
            </div>
            <div class="advantages-grid">
                <div class="advantage-card price-card">
                    <div class="advantage-icon">🤑</div>
                    <h3>Preço Imbatível</h3>
                    <p>O melhor custo-benefício do mercado. Economia comprovada desde o primeiro mês. Realmente imbatível pelo que entregamos!</p>
                    <span class="price-tag">💰 ECONOMIA REAL</span>
                </div>
                <div class="advantage-card">
                    <div class="advantage-icon">🚀</div>
                    <h3>Peças de Reposição Rápidas</h3>
                    <p>Velocidade em peças de reposição. Estoque local e entrega ágil. Sua produção nunca mais vai parar.</p>
                    <span class="advantage-tag">⚡ ENTREGA RÁPIDA</span>
                </div>
                <div class="advantage-card">
                    <div class="advantage-icon">🔧</div>
                    <h3>Manutenção Simplificada</h3>
                    <p>Foco na praticidade. Design inteligente que facilita a vida do seu time de manutenção.</p>
                    <span class="advantage-tag">✓ FÁCIL TROCA</span>
                </div>
                <div class="advantage-card">
                    <div class="advantage-icon">📊</div>
                    <h3>Mais Produtividade</h3>
                    <p>Menos tempo de manutenção = mais horas de produção = mais lucro para a {{empresa}}.</p>
                    <span class="advantage-tag">📈 +PRODUTIVIDADE</span>
                </div>
                <div class="advantage-card">
                    <div class="advantage-icon">🇧🇷</div>
                    <h3>Produto Nacional</h3>
                    <p>Sem dependência de importação. Suporte técnico local e atendimento personalizado.</p>
                    <span class="advantage-tag">🇧🇷 MADE IN BRAZIL</span>
                </div>
                <div class="advantage-card">
                    <div class="advantage-icon">✅</div>
                    <h3>Validada em Campo</h3>
                    <p>Válvulas já testadas e aprovadas em diversas plantas, com performance superior comprovada.</p>
                    <span class="advantage-tag">✓ VALIDADA</span>
                </div>
            </div>
        </div>
    </section>

    <!-- SEÇÃO PERSONALIZADA: ITENS DA PROPOSTA / OPORTUNIDADE (RENDERIZADA JUST-IN-TIME) -->
    <section class="proposta-itens-section">
        <div class="container">
            <div class="proposta-box">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:15px;margin-bottom:15px;">
                    <div>
                        <span style="font-size:0.8em;font-weight:700;color:var(--micro-orange);text-transform:uppercase;letter-spacing:1px;">Resumo Comercial</span>
                        <h3 style="font-size:1.6em;color:var(--micro-black);text-transform:uppercase;margin:4px 0 0;">Proposta Comercial para {{empresa}}</h3>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:0.85em;color:var(--micro-gray);">Oportunidade / Pedido: <strong>{{numero_pedido}}</strong></div>
                        <div style="font-size:1.4em;font-weight:900;color:var(--micro-blue);font-family:'Montserrat',sans-serif;">{{valor}}</div>
                    </div>
                </div>
                {{itens_tabela}}
            </div>
        </div>
    </section>

    <!-- PERSONAL MESSAGE -->
    <section class="personal-message">
        <div class="container">
            <div class="message-box">
                <h3>👋 {{decisor}}, uma mensagem direta para você:</h3>
                <p>
                    Acreditamos que a <strong>{{empresa}}</strong> busca sempre elevar a eficiência da sua linha reduzindo custos operacionais. 
                    Gostaríamos de entender se faz sentido para vocês usufruírem das nossas vantagens competitivas 
                    de forma <strong>exclusiva</strong>.
                </p>
                <p>
                    Nosso atrativo é a <strong>facilidade</strong>, e nosso preço é realmente 💰 <strong>IMBATÍVEL</strong> 💰 pelo que estamos entregando! 
                    Contamos com velocidade em peças de reposição e uma série de melhorias focadas em praticidade, 
                    custo e tempo de manutenção.
                </p>
                <p>
                    Como estão as suas válvulas atuais? Vamos conversar sobre como podemos ajudar a {{empresa}} 
                    a reduzir custos e aumentar a produtividade.
                </p>
                <div class="signature">
                    <strong>{{vendedor_nome}}</strong><br>
                    <span class="role">MiCRO Automação | Válvulas de Sopro PET</span>
                    <span class="role">📱 {{vendedor_telefone}} | ✉️ {{vendedor_email}}</span>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA FINAL SECTION -->
    <section class="cta-final" id="proposta">
        <div class="container">
            <h2>{{decisor}}, <span>Faz Sentido para a {{empresa}}?</span></h2>
            <p class="subtitle">
                Descubra quanto você pode economizar migrando para nossas válvulas de sopro PET
            </p>
            
            <div class="urgency-box">
                ⏰ PROPOSTA EM CARÁTER EXCLUSIVO
            </div>
            
            <div class="cta-buttons-final">
                <a href="mailto:{{vendedor_email}}?subject=Proposta%20Exclusiva%20{{empresa}}%20-%20V%C3%A1lvulas%20PET%20MiCRO&body=Ol%C3%A1%20{{vendedor_nome}},%20gostaria%20de%20receber%20a%20proposta%20exclusiva%20para%20a%20{{empresa}}." class="cta-button" style="padding:18px 36px;font-size:1.05em;">
                    ✉️ SOLICITAR PROPOSTA COMERCIAL
                </a>
                <a href="https://wa.me/{{vendedor_whatsapp_digits}}?text=Ol%C3%A1%20{{vendedor_nome}},%20sou%20da%20{{empresa}}%20e%20gostaria%20de%20conversar%20sobre%20a%20proposta%20de%20v%C3%A1lvulas%20PET." class="cta-button outline" style="padding:18px 36px;font-size:1.05em;" target="_blank">
                    📱 WHATSAPP {{vendedor_nome}}
                </a>
            </div>
            
            <div class="guarantee">
                <div class="guarantee-item">
                    <span class="check">✓</span>
                    <span>Resposta em até 24h</span>
                </div>
                <div class="guarantee-item">
                    <span class="check">✓</span>
                    <span>Proposta personalizada</span>
                </div>
                <div class="guarantee-item">
                    <span class="check">✓</span>
                    <span>Sem compromisso</span>
                </div>
                <div class="guarantee-item">
                    <span class="check">✓</span>
                    <span>Diagnóstico gratuito</span>
                </div>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="logo-blue">
                        MiCRO
                        <span>automação</span>
                    </div>
                    <p>
                        Soluções em válvulas de sopro PET com tecnologia nacional, 
                        preço imbatível e suporte local. Sua produção nunca mais para.
                    </p>
                </div>
                <div class="footer-links">
                    <h4>Contato Comercial</h4>
                    <div style="font-size:0.95em;margin-bottom:8px;"><strong>{{vendedor_nome}}</strong></div>
                    <div style="font-size:0.9em;opacity:0.9;margin-bottom:6px;">📱 {{vendedor_telefone}}</div>
                    <div style="font-size:0.9em;opacity:0.9;margin-bottom:6px;">✉️ {{vendedor_email}}</div>
                    <div style="font-size:0.9em;opacity:0.9;">🌐 www.microautomacao.com.br</div>
                </div>
                <div class="footer-links">
                    <h4>Links Rápidos</h4>
                    <ul>
                        <li><a href="#proposta">Solicitar Proposta</a></li>
                        <li><a href="https://wa.me/{{vendedor_whatsapp_digits}}" target="_blank">WhatsApp Direto</a></li>
                        <li><a href="https://www.microautomacao.com.br" target="_blank">Site MiCRO</a></li>
                        <li><a href="mailto:{{vendedor_email}}">E-mail Comercial</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© {{ano_atual}} MiCRO Automação - Todos os direitos reservados | Proposta Exclusiva {{empresa}} | CNPJ: {{cnpj}}</p>
            </div>
        </div>
    </footer>

</body>
</html>`;

// Template complementar institucional
const TEMPLATE_COMPLEMENTAR_INSTITUCIONAL = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apresentação Técnica & Portfólio | MiCRO Automação para {{empresa}}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Roboto', sans-serif; color:#2d2d2d; background:#f8fafc; line-height:1.6; }
        h1, h2, h3 { font-family:'Montserrat', sans-serif; }
        .nav { background:#fff; padding:18px 30px; border-bottom:3px solid #f26522; display:flex; justify-content:space-between; align-items:center; }
        .logo { background:#0057a8; color:#fff; padding:8px 18px; font-weight:900; font-family:'Montserrat', sans-serif; letter-spacing:2px; font-size:1.4em; border-radius:4px; }
        .logo span { font-size:0.5em; display:block; font-weight:400; letter-spacing:3px; }
        .hero { background:linear-gradient(135deg, #0f172a, #1e293b); color:#fff; padding:90px 20px; text-align:center; }
        .hero .tag { background:#f26522; color:#fff; font-size:0.85em; font-weight:700; padding:6px 16px; border-radius:4px; text-transform:uppercase; display:inline-block; margin-bottom:15px; font-family:'Montserrat',sans-serif; }
        .hero h1 { font-size:2.8em; text-transform:uppercase; margin-bottom:15px; }
        .hero h1 span { color:#f26522; }
        .hero p { font-size:1.2em; max-width:750px; margin:0 auto 30px; opacity:0.9; }
        .container { max-width:1140px; margin:0 auto; padding:60px 20px; }
        .grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:25px; margin-top:35px; }
        .card { background:#fff; padding:30px; border-radius:8px; box-shadow:0 4px 15px rgba(0,0,0,0.06); border-top:4px solid #0057a8; }
        .card h3 { font-size:1.25em; margin-bottom:10px; color:#0f172a; }
        .card p { color:#64748b; font-size:0.95em; }
        .cta { background:#0057a8; color:#fff; padding:60px 20px; text-align:center; }
        .cta h2 { font-size:2.2em; margin-bottom:15px; }
        .btn-orange { background:#f26522; color:#fff; padding:15px 35px; border-radius:4px; text-decoration:none; font-weight:700; font-family:'Montserrat',sans-serif; display:inline-block; text-transform:uppercase; margin-top:20px; }
    </style>
</head>
<body>
    <div class="nav">
        <div class="logo">MiCRO<span>automação</span></div>
        <div style="font-weight:700;color:#0057a8;">Portal Exclusivo: {{empresa}}</div>
    </div>
    <div class="hero">
        <span class="tag">Soluções Industriais Personalizadas</span>
        <h1>Automação Pneumática de Alta Performance para <span>{{empresa}}</span></h1>
        <p>Prezado(a) {{decisor}}, conheça nossa linha completa de cilindros, válvulas, tratamento de ar e tecnologia sob medida com suporte nacional ágil.</p>
        <a href="#contato" class="btn-orange">Falar com Consultor</a>
    </div>
    <div class="container">
        <h2 style="text-align:center;font-size:2em;text-transform:uppercase;color:#0f172a;">Linhas de Produtos MiCRO</h2>
        <div class="grid">
            <div class="card">
                <h3>Válvulas & Ilhas de Válvulas</h3>
                <p>Direcionais, solenóides e de alta vazão para automação de processos contínuos.</p>
            </div>
            <div class="card">
                <h3>Atuadores & Cilindros</h3>
                <p>Linha normalizada ISO, compactos e especiais com resistência mecânica superior.</p>
            </div>
            <div class="card">
                <h3>Preparação de Ar (FRL)</h3>
                <p>Filtros, reguladores e lubrificadores garantindo ar limpo e confiabilidade operacional.</p>
            </div>
            <div class="card">
                <h3>Conexões & Acessórios</h3>
                <p>Engates rápidos, tubos flexíveis e conexões instantâneas em latão niquelado e polímero.</p>
            </div>
        </div>

        <div style="margin-top:50px;background:#fff;padding:35px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.05);border-left:5px solid #f26522;">
            <h3 style="font-size:1.4em;margin-bottom:10px;">Proposta Comercial & Condições para {{empresa}}</h3>
            <p style="color:#64748b;margin-bottom:15px;">Decisor responsável: <strong>{{decisor}}</strong> | Local: <strong>{{cidade_uf}}</strong> | CNPJ: <strong>{{cnpj}}</strong></p>
            {{itens_tabela}}
        </div>
    </div>
    <div class="cta" id="contato">
        <h2>Vamos otimizar sua linha de produção?</h2>
        <p>Consultor Comercial: <strong>{{vendedor_nome}}</strong> | {{vendedor_telefone}} | {{vendedor_email}}</p>
        <a href="https://wa.me/{{vendedor_whatsapp_digits}}" class="btn-orange" target="_blank">Conversar pelo WhatsApp</a>
    </div>
</body>
</html>`;

// ================================================================
// INICIALIZAÇÃO DE MODELOS DE LANDING PAGE
// ================================================================
function inicializarModelosLandingPageExemplo() {
    if (!modelosLandingPage || modelosLandingPage.length === 0) {
        modelosLandingPage = [
            {
                id: 'lp_sopro_pet_oficial',
                nome: 'Válvula de Sopro PET - Proposta Exclusiva MiCRO',
                descricao: 'Modelo oficial MiCRO para indústrias de sopro PET com compatibilidade Norgren e argumentos de redução de custos.',
                padrao: true,
                html: TEMPLATE_PADRAO_SOPRO_PET,
                css: '',
                js: '',
                imagens: [],
                criadoEm: new Date().toISOString(),
                atualizadoEm: new Date().toISOString()
            },
            {
                id: 'lp_institucional_completa',
                nome: 'Apresentação Geral & Linha de Automação MiCRO',
                descricao: 'Apresentação corporativa para clientes gerais e cotações de pneumática, FRL, atuadores e válvulas.',
                padrao: false,
                html: TEMPLATE_COMPLEMENTAR_INSTITUCIONAL,
                css: '',
                js: '',
                imagens: [],
                criadoEm: new Date().toISOString(),
                atualizadoEm: new Date().toISOString()
            }
        ];
        if (typeof salvarDados === 'function') salvarDados();
    }
}

// ================================================================
// RENDERIZAÇÃO SOB DEMANDA (JUST-IN-TIME - ZERO DESPERDÍCIO DE MEMÓRIA)
// ================================================================
function renderizarLandingPageJIT(modeloIdOuObjeto, lead) {
    let modelo = null;
    if (typeof modeloIdOuObjeto === 'object' && modeloIdOuObjeto !== null) {
        modelo = modeloIdOuObjeto;
    } else if (typeof modeloIdOuObjeto === 'string') {
        modelo = (modelosLandingPage || []).find(m => m.id === modeloIdOuObjeto);
    }

    if (!modelo) {
        modelo = (modelosLandingPage || []).find(m => m.padrao) || (modelosLandingPage || [])[0];
    }

    if (!modelo) {
        inicializarModelosLandingPageExemplo();
        modelo = modelosLandingPage[0];
    }

    // Lead de fallback se for simulação sem lead específico
    const leadData = lead || {
        id: 'exemplo',
        empresa: 'Vemaplastic Indústria e Comércio',
        decisor: 'Thomaz',
        cnpj: '12.345.678/0001-90',
        email: 'thomaz@vemaplastic.com.br',
        telefone: '(19) 3888-0000',
        whatsapp: '(19) 98888-0000',
        cidade: 'Campinas',
        estado: 'SP',
        valor: 35000,
        numeroPedido: 'ORC-2026-089',
        itens: [
            { descricao: 'Válvula de Sopro PET High-Flow 40 Bar MiCRO Compatível Norgren', quantidade: 4, preco: 4500 },
            { descricao: 'Kit de Reparo e Vedação Rápida para Válvula de Sopro', quantidade: 8, preco: 850 },
            { descricao: 'Bloco de Distribuição Pneumático Despressurização Rápida', quantidade: 2, preco: 5100 }
        ]
    };

    // Vendedor responsável
    let vendedor = (typeof usuarios !== 'undefined' && Array.isArray(usuarios))
        ? usuarios.find(u => u.id === leadData.usuarioId)
        : null;

    const vendedorNome = vendedor?.nome || (typeof usuarioAtual !== 'undefined' && usuarioAtual?.nome) || 'Fernando Feitosa';
    const vendedorEmail = vendedor?.email || (typeof usuarioAtual !== 'undefined' && usuarioAtual?.email) || 'vendas4.cps@microautomacao.com.br';
    const vendedorTelefone = '(19) 98440-0195';
    const vendedorWhatsappDigits = '5519984400195';

    // Montagem da tabela de itens (se houver itens cotados)
    let itensTabelaHtml = '';
    const itensArray = leadData.itens || (leadData.orcamentoPdfPrincipal?.dadosExtraidos?.itens) || [];
    if (Array.isArray(itensArray) && itensArray.length > 0) {
        let totalCalculado = 0;
        const linhasHtml = itensArray.map((it, idx) => {
            const desc = it.descricao || it.produto || `Item ${idx + 1}`;
            const qtd = Number(it.quantidade || it.qtd || 1);
            const preco = Number(it.preco || it.valorUnitario || it.unitario || 0);
            const subtotal = qtd * preco;
            totalCalculado += subtotal;
            return `
                <tr>
                    <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:600;">${desc}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center;">${qtd}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:right;">${typeof formatarMoeda === 'function' ? formatarMoeda(preco) : 'R$ ' + preco.toFixed(2)}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;color:#0057a8;">${typeof formatarMoeda === 'function' ? formatarMoeda(subtotal) : 'R$ ' + subtotal.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        const totalFinalFormatado = typeof formatarMoeda === 'function'
            ? formatarMoeda(leadData.valor || totalCalculado)
            : 'R$ ' + (leadData.valor || totalCalculado).toFixed(2);

        itensTabelaHtml = `
            <div style="overflow-x:auto;margin:15px 0;">
                <table class="itens-tabela-custom" style="width:100%;border-collapse:collapse;font-size:0.92em;background:#fff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <thead>
                        <tr style="background:#0057a8;color:#fff;text-align:left;">
                            <th style="padding:12px 14px;">Produto / Descrição</th>
                            <th style="padding:12px 14px;text-align:center;">Qtd</th>
                            <th style="padding:12px 14px;text-align:right;">Unitário</th>
                            <th style="padding:12px 14px;text-align:right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${linhasHtml}
                    </tbody>
                    <tfoot>
                        <tr style="background:#f1f5f9;font-weight:700;">
                            <td colspan="3" style="padding:12px 14px;text-align:right;color:#1e293b;">Total Geral da Proposta:</td>
                            <td style="padding:12px 14px;text-align:right;color:#f26522;font-size:1.15em;">${totalFinalFormatado}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    } else {
        itensTabelaHtml = `
            <div style="background:#f8fafc;padding:20px;border-radius:6px;border:1px dashed #cbd5e1;text-align:center;color:#64748b;margin:15px 0;">
                <div style="font-size:1.4em;margin-bottom:6px;">📦</div>
                <div style="font-weight:600;color:#334155;">Proposta Comercial Personalizada Sob Consulta</div>
                <div style="font-size:0.9em;margin-top:4px;">Nossos consultores técnicos configuram as quantidades ideais de válvulas e sobressalentes para a capacidade das suas sopradoras.</div>
            </div>
        `;
    }

    // Formatações
    const cnpjLimpo = (leadData.cnpj || '').replace(/\D/g, '');
    let cnpjFormatado = leadData.cnpj || '';
    if (cnpjLimpo.length === 14) {
        cnpjFormatado = cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }

    const valorFormatado = (typeof formatarMoeda === 'function')
        ? formatarMoeda(leadData.valor || 0)
        : 'R$ ' + Number(leadData.valor || 0).toFixed(2);

    const hojeStr = new Date().toLocaleDateString('pt-BR');
    const anoAtualStr = String(new Date().getFullYear());
    const cidadeUf = [leadData.cidade, leadData.estado].filter(Boolean).join(' - ') || 'Brasil';

    // Mapa de interpolação
    const variaveis = {
        empresa: leadData.empresa || 'Sua Empresa',
        decisor: leadData.decisor || 'Thomaz',
        cnpj: cnpjFormatado || 'Consulte seu consultor',
        cnpj_formatado: cnpjFormatado || '',
        cnpj_limpo: cnpjLimpo || '',
        email: leadData.email || 'comercial@microautomacao.com.br',
        telefone: leadData.telefone || '(19) 98440-0195',
        whatsapp: leadData.whatsapp || '(19) 98440-0195',
        cidade: leadData.cidade || 'Campinas',
        estado: leadData.estado || 'SP',
        cidade_uf: cidadeUf,
        valor: valorFormatado,
        valor_formatado: valorFormatado,
        numero_pedido: leadData.numeroPedido || `PROP-${leadData.id ? String(leadData.id).slice(0, 6).toUpperCase() : '2026'}`,
        numero_orcamento: leadData.numeroPedido || `PROP-${leadData.id ? String(leadData.id).slice(0, 6).toUpperCase() : '2026'}`,
        itens_tabela: itensTabelaHtml,
        vendedor_nome: vendedorNome,
        vendedor_email: vendedorEmail,
        vendedor_telefone: vendedorTelefone,
        vendedor_whatsapp: vendedorTelefone,
        vendedor_whatsapp_digits: vendedorWhatsappDigits,
        whatsapp_link: `https://wa.me/${vendedorWhatsappDigits}?text=${encodeURIComponent('Olá, gostaria de falar sobre a proposta comercial da MiCRO Automação.')}`,
        data_hoje: hojeStr,
        ano_atual: anoAtualStr
    };

    let htmlFinal = modelo.html || TEMPLATE_PADRAO_SOPRO_PET;

    // Substituição das variáveis em regex case-insensitive {{ variavel }}
    Object.keys(variaveis).forEach(key => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
        htmlFinal = htmlFinal.replace(regex, variaveis[key]);
    });

    // Injeção de CSS adicional se houver
    if (modelo.css && modelo.css.trim()) {
        htmlFinal = htmlFinal.replace('</head>', `<style id="lp-custom-css">\n${modelo.css}\n</style>\n</head>`);
    }

    // Injeção de JS adicional se houver
    if (modelo.js && modelo.js.trim()) {
        htmlFinal = htmlFinal.replace('</body>', `<script id="lp-custom-js">\n${modelo.js}\n</script>\n</body>`);
    }

    return htmlFinal;
}

// ================================================================
// GESTÃO NA ABA DE MARKETING
// ================================================================
function alternarSubabaMarketing(subaba) {
    const btnEmail = document.getElementById('subtabBtnEmailMarketing');
    const btnLP = document.getElementById('subtabBtnLandingPages');
    const painelEmail = document.getElementById('painelMarketingEmail');
    const painelLP = document.getElementById('painelMarketingLandingPages');

    if (!painelEmail || !painelLP) return;

    if (subaba === 'landing_pages') {
        btnEmail?.classList.remove('btn-primary');
        btnEmail?.classList.add('btn-outline');
        btnLP?.classList.remove('btn-outline');
        btnLP?.classList.add('btn-primary');
        painelEmail.style.display = 'none';
        painelLP.style.display = 'block';
        renderizarPainelLandingPagesMarketing();
    } else {
        btnLP?.classList.remove('btn-primary');
        btnLP?.classList.add('btn-outline');
        btnEmail?.classList.remove('btn-outline');
        btnEmail?.classList.add('btn-primary');
        painelLP.style.display = 'none';
        painelEmail.style.display = 'block';
    }
}

function renderizarPainelLandingPagesMarketing() {
    inicializarModelosLandingPageExemplo();

    // Atualiza contadores
    const elTotalModelos = document.getElementById('lpTotalModelos');
    const elTotalLeadsAtivos = document.getElementById('lpTotalLeadsAtivos');
    const elTotalViews = document.getElementById('lpTotalViews');

    const totalModelos = (modelosLandingPage || []).length;
    const leadsComLp = (typeof leads !== 'undefined' ? leads : []).filter(l => l.landingPageAtiva !== false).length;
    const viewsTotais = (typeof leads !== 'undefined' ? leads : []).reduce((acc, l) => acc + (Number(l.landingPageViews) || 0), 0);

    if (elTotalModelos) elTotalModelos.textContent = totalModelos;
    if (elTotalLeadsAtivos) elTotalLeadsAtivos.textContent = leadsComLp;
    if (elTotalViews) elTotalViews.textContent = viewsTotais;

    const listaContainer = document.getElementById('lpModelosList');
    if (!listaContainer) return;

    if (!modelosLandingPage || modelosLandingPage.length === 0) {
        listaContainer.innerHTML = `
            <div class="empty-state compact">
                <span class="emoji-big">🌐</span>
                <p class="text-sm">Nenhum modelo de landing page criado ainda.</p>
                <button class="btn btn-primary btn-sm mt-8" onclick="abrirModalEditorLandingPage()">Criar Primeiro Modelo</button>
            </div>
        `;
        return;
    }

    listaContainer.innerHTML = modelosLandingPage.map(m => {
        return `
            <div class="marketing-lp-card" style="background:var(--card-bg, #fff);border:1px solid var(--border-color, #e2e8f0);border-radius:8px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;position:relative;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                        <h4 style="font-size:15px;font-weight:700;margin:0;color:var(--text-primary);display:flex;align-items:center;gap:6px;">
                            <span>🌐</span> ${m.nome}
                        </h4>
                        ${m.padrao ? `<span class="badge" style="background:var(--success, #16a34a);color:#fff;font-size:10px;padding:2px 8px;border-radius:12px;font-weight:700;">★ PADRÃO</span>` : ''}
                    </div>
                    <p class="text-xs text-muted" style="margin:8px 0 0;line-height:1.5;">${m.descricao || 'Sem descrição informada.'}</p>
                </div>
                <div style="border-top:1px solid var(--border-color, #eee);padding-top:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                    <div class="text-xs text-muted">
                        Renderização JIT sob demanda
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        <button class="btn btn-outline btn-xs" onclick="abrirPreviewLandingPage('${m.id}')" title="Testar e visualizar com lead">👁️ Simular</button>
                        <button class="btn btn-primary btn-xs" onclick="abrirModalEditorLandingPage('${m.id}')" title="Editar código HTML, CSS, JS">✏️ Editar</button>
                        <button class="btn btn-outline btn-xs" onclick="duplicarModeloLandingPage('${m.id}')" title="Duplicar modelo">📋 Copiar</button>
                        ${!m.padrao ? `<button class="btn btn-outline btn-xs" onclick="definirModeloLandingPagePadrao('${m.id}')" title="Definir como padrão">⭐ Padrão</button>` : ''}
                        ${modelosLandingPage.length > 1 ? `<button class="btn btn-danger btn-xs" onclick="excluirModeloLandingPage('${m.id}')" title="Excluir">✕</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ================================================================
// EDITOR DE LANDING PAGE (HTML, CSS, JS, IMAGENS)
// ================================================================
let lpModeloEmEdicaoId = null;
let lpAbaEditorAtual = 'html';
let lpModoVisualizacaoEditor = 'split'; // 'split', 'codigo', 'preview'
let lpDebouncePreviewTimer = null;

function abrirModalEditorLandingPage(modeloId = null) {
    inicializarModelosLandingPageExemplo();
    lpModeloEmEdicaoId = modeloId;

    const titulo = document.getElementById('lpEditorModalTitle') || document.getElementById('editorLpModalTitle');
    const inputId = document.getElementById('lpEditorModeloId');
    const inputNome = document.getElementById('lpEditorNome') || document.getElementById('editorLpNome');
    const inputDescricao = document.getElementById('lpEditorDescricao') || document.getElementById('editorLpDescricao');
    const txtHtml = document.getElementById('lpEditorHtml') || document.getElementById('editorLpHtml');
    const txtCss = document.getElementById('lpEditorCss') || document.getElementById('editorLpCss');
    const txtJs = document.getElementById('lpEditorJs') || document.getElementById('editorLpJs');
    const checkPadrao = document.getElementById('lpEditorPadrao') || document.getElementById('editorLpPadrao');
    const inputHeroImg = document.getElementById('lpEditorHeroImg');
    const inputLogoImg = document.getElementById('lpEditorLogoImg');
    const inputCorPrimaria = document.getElementById('lpEditorCorPrimaria');

    if (inputId) inputId.value = modeloId || '';

    if (modeloId) {
        const modelo = (modelosLandingPage || []).find(m => m.id === modeloId);
        if (!modelo) {
            showToast('Modelo de Landing Page não encontrado.', 'error');
            return;
        }
        if (titulo) titulo.textContent = `Editar Landing Page: ${modelo.nome}`;
        if (inputNome) inputNome.value = modelo.nome || '';
        if (inputDescricao) inputDescricao.value = modelo.descricao || '';
        if (txtHtml) txtHtml.value = modelo.html || TEMPLATE_PADRAO_SOPRO_PET;
        if (txtCss) txtCss.value = modelo.css || '';
        if (txtJs) txtJs.value = modelo.js || '';
        if (checkPadrao) checkPadrao.checked = Boolean(modelo.padrao);
        if (inputHeroImg) inputHeroImg.value = modelo.heroImg || '';
        if (inputLogoImg) inputLogoImg.value = modelo.logoImg || '';
        if (inputCorPrimaria) inputCorPrimaria.value = modelo.corPrimaria || '#0057a8';
    } else {
        if (titulo) titulo.textContent = 'Novo Modelo de Landing Page Comercial';
        if (inputNome) inputNome.value = 'Nova Proposta Comercial Personalizada';
        if (inputDescricao) inputDescricao.value = 'Modelo para apresentação técnica e comercial aos clientes';
        if (txtHtml) txtHtml.value = TEMPLATE_PADRAO_SOPRO_PET;
        if (txtCss) txtCss.value = '';
        if (txtJs) txtJs.value = '';
        if (checkPadrao) checkPadrao.checked = (modelosLandingPage || []).length === 0;
        if (inputHeroImg) inputHeroImg.value = '';
        if (inputLogoImg) inputLogoImg.value = '';
        if (inputCorPrimaria) inputCorPrimaria.value = '#0057a8';
    }

    // Preenche seletor de leads para simulação ao vivo
    popularSeletorLeadsSimulacaoEditor();

    // Configura listeners de digitação em tempo real (se ainda não registrados)
    configurarListenersEdicaoAoVivo();

    // Inicia na aba HTML
    alternarAbaEditorLP('html');

    // Reseta visualização split se necessário
    const colCodigo = document.getElementById('lpEditorColunaCodigo');
    const colPreview = document.getElementById('lpEditorColunaPreview');
    if (colCodigo) colCodigo.style.display = 'flex';
    if (colPreview) colPreview.style.display = 'flex';
    lpModoVisualizacaoEditor = 'split';

    // Atualiza o preview ao vivo com o conteúdo atual
    atualizarLivePreviewEditorLP();

    // Abre o modal
    abrirModal('editorLandingPageModal');
}

function popularSeletorLeadsSimulacaoEditor() {
    const sel = document.getElementById('lpEditorSimularLeadId') || document.getElementById('editorLpSimuladorLeadSelect');
    if (!sel) return;

    const leadsLista = (typeof leads !== 'undefined' && Array.isArray(leads)) ? leads : [];
    if (leadsLista.length === 0) {
        sel.innerHTML = '<option value="">Lead de Demonstração (Vemaplastic)</option>';
        return;
    }

    sel.innerHTML = `
        <option value="">Lead de Demonstração (Vemaplastic)</option>
        ${leadsLista.map(l => `<option value="${l.id}">${l.empresa} (${l.decisor || 'Decisor'})</option>`).join('')}
    `;
}

function configurarListenersEdicaoAoVivo() {
    const campos = ['lpEditorHtml', 'lpEditorCss', 'lpEditorJs', 'lpEditorHeroImg', 'lpEditorLogoImg', 'lpEditorCorPrimaria'];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.dataset.listenerLp) {
            el.dataset.listenerLp = 'true';
            el.addEventListener('input', () => {
                clearTimeout(lpDebouncePreviewTimer);
                lpDebouncePreviewTimer = setTimeout(atualizarLivePreviewEditorLP, 200);
            });
        }
    });
}

function alternarAbaEditorLP(aba) {
    lpAbaEditorAtual = aba;

    // Atualiza botões das abas
    const tabs = [
        { id: 'btnTabEditorHtml', panel: 'lpEditorPainelHtml', name: 'html' },
        { id: 'btnTabEditorCss', panel: 'lpEditorPainelCss', name: 'css' },
        { id: 'btnTabEditorJs', panel: 'lpEditorPainelJs', name: 'js' },
        { id: 'btnTabEditorImagens', panel: 'lpEditorPainelImagens', name: 'imagens' }
    ];

    tabs.forEach(t => {
        const btn = document.getElementById(t.id);
        const panel = document.getElementById(t.panel);
        const isActive = t.name === aba;

        if (btn) btn.classList.toggle('active', isActive);
        if (panel) panel.style.display = isActive ? 'flex' : 'none';
    });
}

function inserirTagEditor(tag) {
    // Localiza o textarea ativo
    let target = document.getElementById('lpEditorHtml');
    if (lpAbaEditorAtual === 'css') {
        target = document.getElementById('lpEditorCss');
    } else if (lpAbaEditorAtual === 'js') {
        target = document.getElementById('lpEditorJs');
    }

    if (!target) return;

    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const text = target.value;

    target.value = text.substring(0, start) + tag + text.substring(end);
    target.focus();
    target.selectionStart = target.selectionEnd = start + tag.length;

    atualizarLivePreviewEditorLP();
}

function setEditorViewport(width) {
    const iframe = document.getElementById('lpEditorIframe');
    if (!iframe) return;

    iframe.style.width = width;

    const btns = [
        { id: 'btnViewportDesktop', width: '100%' },
        { id: 'btnViewportTablet', width: '768px' },
        { id: 'btnViewportMobile', width: '375px' }
    ];

    btns.forEach(b => {
        const btn = document.getElementById(b.id);
        if (btn) btn.classList.toggle('active', b.width === width);
    });
}

function alternarPreviewEditorLP() {
    const colCodigo = document.getElementById('lpEditorColunaCodigo');
    const colPreview = document.getElementById('lpEditorColunaPreview');
    if (!colCodigo || !colPreview) return;

    if (lpModoVisualizacaoEditor === 'split') {
        lpModoVisualizacaoEditor = 'preview';
        colCodigo.style.display = 'none';
        colPreview.style.display = 'flex';
        colPreview.style.flex = '1';
    } else if (lpModoVisualizacaoEditor === 'preview') {
        lpModoVisualizacaoEditor = 'codigo';
        colCodigo.style.display = 'flex';
        colCodigo.style.flex = '1';
        colPreview.style.display = 'none';
    } else {
        lpModoVisualizacaoEditor = 'split';
        colCodigo.style.display = 'flex';
        colCodigo.style.flex = '1';
        colPreview.style.display = 'flex';
        colPreview.style.flex = '1';
    }
}

function atualizarLivePreviewEditorLP() {
    const iframe = document.getElementById('lpEditorIframe') || document.getElementById('editorLpLivePreviewIframe');
    if (!iframe) return;

    const selLead = document.getElementById('lpEditorSimularLeadId') || document.getElementById('editorLpSimuladorLeadSelect');
    const leadId = selLead ? selLead.value : null;
    const leadObj = (typeof leads !== 'undefined' && Array.isArray(leads)) ? leads.find(l => l.id === leadId) : null;

    const txtHtml = document.getElementById('lpEditorHtml') || document.getElementById('editorLpHtml');
    const txtCss = document.getElementById('lpEditorCss') || document.getElementById('editorLpCss');
    const txtJs = document.getElementById('lpEditorJs') || document.getElementById('editorLpJs');
    const inputHeroImg = document.getElementById('lpEditorHeroImg');
    const inputLogoImg = document.getElementById('lpEditorLogoImg');
    const inputCorPrimaria = document.getElementById('lpEditorCorPrimaria');

    const modeloTemp = {
        html: (txtHtml && txtHtml.value.trim()) ? txtHtml.value : TEMPLATE_PADRAO_SOPRO_PET,
        css: txtCss ? txtCss.value : '',
        js: txtJs ? txtJs.value : '',
        heroImg: inputHeroImg ? inputHeroImg.value.trim() : '',
        logoImg: inputLogoImg ? inputLogoImg.value.trim() : '',
        corPrimaria: inputCorPrimaria ? inputCorPrimaria.value : '#0057a8'
    };

    const renderedHtml = renderizarLandingPageJIT(modeloTemp, leadObj);
    iframe.srcdoc = renderedHtml;
}

function salvarModeloLandingPage(event) {
    if (event) event.preventDefault();

    const idInput = document.getElementById('lpEditorModeloId');
    const nomeInput = document.getElementById('lpEditorNome');
    const descInput = document.getElementById('lpEditorDescricao');
    const padraoInput = document.getElementById('lpEditorPadrao');
    const htmlInput = document.getElementById('lpEditorHtml');
    const cssInput = document.getElementById('lpEditorCss');
    const jsInput = document.getElementById('lpEditorJs');
    const heroImgInput = document.getElementById('lpEditorHeroImg');
    const logoImgInput = document.getElementById('lpEditorLogoImg');
    const corPrimariaInput = document.getElementById('lpEditorCorPrimaria');

    const modeloId = idInput ? idInput.value.trim() : lpModeloEmEdicaoId;
    const nome = nomeInput ? nomeInput.value.trim() : '';
    const descricao = descInput ? descInput.value.trim() : '';
    const padrao = padraoInput ? padraoInput.checked : false;
    const html = htmlInput ? htmlInput.value.trim() : '';
    const css = cssInput ? cssInput.value.trim() : '';
    const js = jsInput ? jsInput.value.trim() : '';
    const heroImg = heroImgInput ? heroImgInput.value.trim() : '';
    const logoImg = logoImgInput ? logoImgInput.value.trim() : '';
    const corPrimaria = corPrimariaInput ? corPrimariaInput.value : '#0057a8';

    if (!nome) {
        showToast('Por favor, informe o nome do modelo de Landing Page.', 'warning');
        if (nomeInput) nomeInput.focus();
        return;
    }

    if (!html) {
        showToast('O código HTML não pode estar em branco.', 'warning');
        return;
    }

    if (padrao) {
        (modelosLandingPage || []).forEach(m => m.padrao = false);
    }

    if (modeloId) {
        const idx = (modelosLandingPage || []).findIndex(m => m.id === modeloId);
        if (idx !== -1) {
            modelosLandingPage[idx] = {
                ...modelosLandingPage[idx],
                nome,
                descricao,
                padrao: padrao || modelosLandingPage[idx].padrao,
                html,
                css,
                js,
                heroImg,
                logoImg,
                corPrimaria,
                atualizadoEm: new Date().toISOString()
            };
            showToast(`Modelo "${nome}" atualizado com sucesso!`, 'success');
        }
    } else {
        const novoId = 'lp_' + Date.now();
        const novoModelo = {
            id: novoId,
            nome,
            descricao,
            padrao: padrao || (modelosLandingPage || []).length === 0,
            html,
            css,
            js,
            heroImg,
            logoImg,
            corPrimaria,
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString()
        };
        modelosLandingPage.push(novoModelo);
        showToast(`Novo modelo "${nome}" criado com sucesso!`, 'success');
    }

    // Persistência forçada
    if (typeof salvarDados === 'function') salvarDados();

    fecharModal('editorLandingPageModal');
    renderizarPainelLandingPagesMarketing();
}

function duplicarModeloLandingPage(modeloId) {
    const original = (modelosLandingPage || []).find(m => m.id === modeloId);
    if (!original) return;

    const novoModelo = {
        ...JSON.parse(JSON.stringify(original)),
        id: 'lp_' + Date.now(),
        nome: `${original.nome} (Cópia)`,
        padrao: false,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
    };

    modelosLandingPage.push(novoModelo);
    if (typeof salvarDados === 'function') salvarDados();
    renderizarPainelLandingPagesMarketing();
    showToast(`Modelo copiado como "${novoModelo.nome}"!`, 'success');
}

function definirModeloLandingPagePadrao(modeloId) {
    (modelosLandingPage || []).forEach(m => m.padrao = (m.id === modeloId));
    if (typeof salvarDados === 'function') salvarDados();
    renderizarPainelLandingPagesMarketing();
    showToast('Modelo padrão atualizado!', 'success');
}

function excluirModeloLandingPage(modeloId) {
    if ((modelosLandingPage || []).length <= 1) {
        showToast('Você deve manter pelo menos um modelo de Landing Page no sistema.', 'warning');
        return;
    }
    const modelo = (modelosLandingPage || []).find(m => m.id === modeloId);
    if (!confirm(`Deseja realmente excluir o modelo "${modelo?.nome || 'Selecionado'}"?`)) return;

    modelosLandingPage = modelosLandingPage.filter(m => m.id !== modeloId);
    if (!modelosLandingPage.some(m => m.padrao)) {
        modelosLandingPage[0].padrao = true;
    }

    if (typeof salvarDados === 'function') salvarDados();
    renderizarPainelLandingPagesMarketing();
    showToast('Modelo excluído com sucesso!', 'info');
}

// ================================================================
// MODAL DE PREVIEW DA LANDING PAGE COM QUALQUER LEAD
// ================================================================
let lpPreviewModeloId = null;

function abrirPreviewLandingPage(modeloId = null, leadId = null) {
    inicializarModelosLandingPageExemplo();
    lpPreviewModeloId = modeloId;

    const selModelo = document.getElementById('lpPreviewSelectModelo');
    const selLead = document.getElementById('lpPreviewSelectLead');

    if (selModelo) {
        selModelo.innerHTML = (modelosLandingPage || []).map(m => {
            const isSelected = modeloId ? (m.id === modeloId) : Boolean(m.padrao);
            return `<option value="${m.id}" ${isSelected ? 'selected' : ''}>${m.nome} ${m.padrao ? '(Padrão)' : ''}</option>`;
        }).join('');
    }

    if (selLead) {
        const leadsLista = (typeof leads !== 'undefined' && Array.isArray(leads)) ? leads : [];
        if (leadsLista.length === 0) {
            selLead.innerHTML = '<option value="">Lead Demonstração Vemaplastic</option>';
        } else {
            selLead.innerHTML = `
                <option value="">Lead Demonstração Vemaplastic</option>
                ${leadsLista.map(l => `<option value="${l.id}" ${leadId === l.id ? 'selected' : ''}>${l.empresa} (${l.decisor || 'Decisor'})</option>`).join('')}
            `;
        }
    }

    recarregarPreviewModalLP();
    setModalPreviewViewport('100%');
    abrirModal('previewLandingPageModal');
}

function recarregarPreviewModalLP() {
    const iframe = document.getElementById('lpPreviewModalIframe') || document.getElementById('previewLpIframe');
    if (!iframe) return;

    const selModelo = document.getElementById('lpPreviewSelectModelo');
    const selLead = document.getElementById('lpPreviewSelectLead');

    const modeloId = selModelo ? selModelo.value : lpPreviewModeloId;
    const leadId = selLead ? selLead.value : null;

    const modelo = (modelosLandingPage || []).find(m => m.id === modeloId);
    const leadObj = (typeof leads !== 'undefined' && Array.isArray(leads)) ? leads.find(l => l.id === leadId) : null;

    const rendered = renderizarLandingPageJIT(modelo, leadObj);
    iframe.srcdoc = rendered;
}

function setModalPreviewViewport(width) {
    const iframe = document.getElementById('lpPreviewModalIframe');
    if (!iframe) return;

    iframe.style.width = width;

    const btns = [
        { id: 'btnModalVpDesktop', width: '100%' },
        { id: 'btnModalVpTablet', width: '768px' },
        { id: 'btnModalVpMobile', width: '375px' }
    ];

    btns.forEach(b => {
        const btn = document.getElementById(b.id);
        if (btn) btn.classList.toggle('active', b.width === width);
    });
}

function abrirPreviewEmNovaAba() {
    const selModelo = document.getElementById('lpPreviewSelectModelo');
    const selLead = document.getElementById('lpPreviewSelectLead');

    const modeloId = selModelo ? selModelo.value : lpPreviewModeloId;
    const leadId = selLead ? selLead.value : null;

    const modelo = (modelosLandingPage || []).find(m => m.id === modeloId);
    const leadObj = (typeof leads !== 'undefined' && Array.isArray(leads)) ? leads.find(l => l.id === leadId) : null;

    const rendered = renderizarLandingPageJIT(modelo, leadObj);

    const win = window.open('', '_blank');
    if (win) {
        win.document.open();
        win.document.write(rendered);
        win.document.close();
    } else {
        const blob = new Blob([rendered], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
}

// ================================================================
// AÇÕES DO LEAD NO CRM (PIPELINE / MODAL DO LEAD)
// ================================================================
let leadLpModalAtivoId = null;

function abrirModalLandingPageLead(leadId) {
    const lead = (typeof leads !== 'undefined' && Array.isArray(leads)) ? leads.find(l => l.id === leadId) : null;
    if (!lead) {
        showToast('Lead não encontrado.', 'error');
        return;
    }

    leadLpModalAtivoId = leadId;
    inicializarModelosLandingPageExemplo();

    // Preenche campos do modal
    const elId = document.getElementById('lpLeadId');
    const elEmpresa = document.getElementById('lpLeadEmpresa');
    const elDecisor = document.getElementById('lpLeadDecisor');
    const elEmail = document.getElementById('lpLeadEmail');
    const elCnpj = document.getElementById('lpLeadCnpj');
    const elTotalViews = document.getElementById('lpLeadTotalViews');
    const elUltimoAcesso = document.getElementById('lpLeadUltimoAcesso');
    const selModelo = document.getElementById('lpLeadModeloId');
    const elUrl = document.getElementById('lpLeadUrl');
    const elMsg = document.getElementById('lpLeadMensagemCustomizada');

    if (elId) elId.value = lead.id;
    if (elEmpresa) elEmpresa.textContent = lead.empresa;
    if (elDecisor) elDecisor.textContent = lead.decisor || 'Contato não especificado';
    if (elEmail) elEmail.textContent = lead.email || 'Não informado';

    const cnpjLimpo = (lead.cnpj || '').replace(/\D/g, '');
    if (elCnpj) elCnpj.textContent = lead.cnpj ? `${lead.cnpj} (${cnpjLimpo})` : 'CNPJ não informado';

    if (elTotalViews) elTotalViews.textContent = lead.landingPageViews || 0;
    if (elUltimoAcesso) {
        elUltimoAcesso.textContent = lead.landingPageUltimoAcesso
            ? new Date(lead.landingPageUltimoAcesso).toLocaleString('pt-BR')
            : 'Nunca acessou';
    }

    // URL Exclusiva do Cliente
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const clientUrl = `${baseUrl}?lp=${lead.id}`;
    if (elUrl) elUrl.value = clientUrl;

    if (elMsg) elMsg.value = lead.landingPageMensagem || '';

    // Seletor de modelos
    if (selModelo) {
        selModelo.innerHTML = (modelosLandingPage || []).map(m => {
            const isSelected = lead.landingPageModeloId === m.id || (!lead.landingPageModeloId && m.padrao);
            return `<option value="${m.id}" ${isSelected ? 'selected' : ''}>${m.nome} ${m.padrao ? '(Padrão)' : ''}</option>`;
        }).join('');
    }

    abrirModal('landingPageLeadModal');
}

function salvarLandingPageLead(event) {
    if (event) event.preventDefault();

    const leadId = document.getElementById('lpLeadId')?.value || leadLpModalAtivoId;
    const lead = (typeof leads !== 'undefined' && Array.isArray(leads)) ? leads.find(l => l.id === leadId) : null;
    if (!lead) return;

    const selModelo = document.getElementById('lpLeadModeloId');
    const elMsg = document.getElementById('lpLeadMensagemCustomizada');

    if (selModelo) lead.landingPageModeloId = selModelo.value;
    if (elMsg) lead.landingPageMensagem = elMsg.value.trim();

    lead.atualizadoEm = new Date().toISOString();

    if (typeof salvarDados === 'function') salvarDados();
    if (typeof salvarLeadNoBanco === 'function') salvarLeadNoBanco(lead);

    showToast(`Configurações de Landing Page salvas para ${lead.empresa}!`, 'success');
    fecharModal('landingPageLeadModal');

    if (typeof renderizarPipeline === 'function') renderizarPipeline();
    if (typeof renderizarClientes === 'function') renderizarClientes();
}

function visualizarModeloSelecionadoLead() {
    const selModelo = document.getElementById('lpLeadModeloId');
    const modeloId = selModelo ? selModelo.value : null;
    const leadId = document.getElementById('lpLeadId')?.value || leadLpModalAtivoId;
    abrirPreviewLandingPage(modeloId, leadId);
}

function copiarLinkAcessoLead() {
    const elUrl = document.getElementById('lpLeadUrl');
    if (!elUrl || !elUrl.value) return;

    navigator.clipboard.writeText(elUrl.value).then(() => {
        showToast('Link exclusivo do cliente copiado com sucesso!', 'success');
    }).catch(() => {
        elUrl.select();
        document.execCommand('copy');
        showToast('Link copiado!', 'success');
    });
}

function copiarConviteWhatsAppLead() {
    const leadId = document.getElementById('lpLeadId')?.value || leadLpModalAtivoId;
    const lead = (typeof leads !== 'undefined' && Array.isArray(leads)) ? leads.find(l => l.id === leadId) : null;
    if (!lead) return;

    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const clientUrl = `${baseUrl}?lp=${lead.id}`;
    const decisor = lead.decisor || 'Diretoria';
    const emailLogin = lead.email || 'seu e-mail comercial';
    const cnpjSenha = lead.cnpj || 'seu CNPJ';
    const msgCustom = document.getElementById('lpLeadMensagemCustomizada')?.value.trim();

    let texto = `Olá, ${decisor}! Preparamos uma proposta comercial personalizada e exclusiva para a ${lead.empresa} na MiCRO Automação.\n\n🌐 Acesse seu portal seguro: ${clientUrl}\n🔐 Login: ${emailLogin}\n🔑 Senha (CNPJ): ${cnpjSenha}`;

    if (msgCustom) {
        texto += `\n\n📌 Observação do Consultor: ${msgCustom}`;
    }

    texto += `\n\nQualquer dúvida sobre as especificações técnicas, fico à disposição!`;

    navigator.clipboard.writeText(texto).then(() => {
        showToast('Mensagem de convite copiada! Pronta para colar no WhatsApp.', 'success');
    }).catch(() => {
        prompt('Copie a mensagem de convite abaixo:', texto);
    });
}

function visualizarLandingPageLeadComoCliente() {
    const leadId = document.getElementById('lpLeadId')?.value || leadLpModalAtivoId;
    const lead = (typeof leads !== 'undefined' && Array.isArray(leads)) ? leads.find(l => l.id === leadId) : null;
    if (!lead) return;

    const selModelo = document.getElementById('lpLeadModeloId');
    const modeloId = selModelo ? selModelo.value : lead.landingPageModeloId;

    const rendered = renderizarLandingPageJIT(modeloId, lead);

    const win = window.open('', '_blank');
    if (win) {
        win.document.open();
        win.document.write(rendered);
        win.document.close();
    } else {
        const blob = new Blob([rendered], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
}

// Aliases de retrocompatibilidade
const salvarModeloLandingPageDoEditor = salvarModeloLandingPage;
const alternarAbaEditorLandingPage = alternarAbaEditorLP;
const inserirVariavelEditorLp = inserirTagEditor;
const atualizarLivePreviewEditor = atualizarLivePreviewEditorLP;
const alternarDispositivoPreviewEditor = setEditorViewport;
const salvarConfigLandingPageLead = salvarLandingPageLead;
const copiarLinkLandingPageLead = copiarLinkAcessoLead;
const abrirLandingPageComoCliente = visualizarLandingPageLeadComoCliente;
const abrirNovaAbaPreviewModal = abrirPreviewEmNovaAba;


// ================================================================
// PORTAL DO CLIENTE COM LOGIN (E-MAIL) E SENHA (CNPJ)
// ================================================================
let leadClienteAutenticado = null;

async function verificarAcessoPortalCliente() {
    const urlParams = new URLSearchParams(window.location.search);
    const lpParam = urlParams.get('lp') || urlParams.get('portal');
    const hash = window.location.hash;

    let leadIdDetectado = lpParam;
    if (!leadIdDetectado && hash.startsWith('#lp/')) {
        leadIdDetectado = hash.replace('#lp/', '').trim();
    }

    // Verifica se já existe sessão de cliente autenticada no sessionStorage
    const sessaoSalva = sessionStorage.getItem('crm_cliente_sessao');
    if (sessaoSalva) {
        try {
            const sessao = JSON.parse(sessaoSalva);
            if (sessao && sessao.leadId) {
                // Aguarda leads estarem disponíveis
                if (typeof leads !== 'undefined' && leads.length > 0) {
                    const lead = leads.find(l => l.id === sessao.leadId);
                    if (lead) {
                        iniciarSessaoPortalCliente(lead, false);
                        return true;
                    }
                }
            }
        } catch (e) {}
    }

    if (leadIdDetectado) {
        // Exibe a tela de login exclusiva do portal do cliente
        exibirTelaLoginCliente(leadIdDetectado);
        return true;
    }

    return false;
}

function exibirTelaLoginCliente(leadIdOpcional) {
    const crmLogin = document.getElementById('loginScreen');
    const appWrapper = document.getElementById('appWrapper');
    const portalLogin = document.getElementById('clientePortalLoginScreen');
    const portalView = document.getElementById('clientePortalView');

    if (crmLogin) crmLogin.style.display = 'none';
    if (appWrapper) appWrapper.style.display = 'none';
    if (portalView) portalView.style.display = 'none';
    if (portalLogin) portalLogin.style.display = 'flex';

    const inputLeadId = document.getElementById('clienteLoginLeadId');
    const infoEmpresa = document.getElementById('clienteLoginInfoEmpresa');
    const errEl = document.getElementById('clienteLoginError');

    if (errEl) errEl.style.display = 'none';

    if (inputLeadId) inputLeadId.value = leadIdOpcional || '';

    // Se o lead for localizado, podemos cumprimentar a empresa
    if (leadIdOpcional && typeof leads !== 'undefined' && leads.length > 0) {
        const lead = leads.find(l => l.id === leadIdOpcional);
        if (lead && infoEmpresa) {
            infoEmpresa.textContent = `Área Exclusiva: ${lead.empresa}`;
            infoEmpresa.style.display = 'block';
            if (lead.email) {
                const inputEmail = document.getElementById('clienteLoginEmail');
                if (inputEmail && !inputEmail.value) inputEmail.value = lead.email;
            }
        }
    }
}

function autenticarClientePortal(event) {
    if (event) event.preventDefault();
    const inputLeadId = document.getElementById('clienteLoginLeadId')?.value.trim();
    const inputEmail = document.getElementById('clienteLoginEmail')?.value.trim().toLowerCase();
    const inputCnpj = document.getElementById('clienteLoginCnpj')?.value.trim();
    const errEl = document.getElementById('clienteLoginError');

    if (!inputEmail || !inputCnpj) {
        if (errEl) {
            errEl.textContent = 'Por favor, informe seu e-mail corporativo e o CNPJ da empresa.';
            errEl.style.display = 'block';
        }
        return;
    }

    const cnpjDigitos = inputCnpj.replace(/\D/g, '');
    const leadsLista = (typeof leads !== 'undefined' ? leads : []);

    let leadEncontrado = null;

    // 1. Se veio lead ID específico no link, valida contra ele
    if (inputLeadId) {
        const leadCandidato = leadsLista.find(l => l.id === inputLeadId);
        if (leadCandidato) {
            const leadCnpjLimpo = (leadCandidato.cnpj || '').replace(/\D/g, '');
            const leadEmailLimpo = (leadCandidato.email || '').trim().toLowerCase();

            // Valida CNPJ (aceita se bater, ou se o lead não tiver CNPJ ainda)
            const cnpjBate = !leadCnpjLimpo || cnpjDigitos === leadCnpjLimpo || cnpjDigitos.includes(leadCnpjLimpo) || leadCnpjLimpo.includes(cnpjDigitos);
            const emailBate = !leadEmailLimpo || leadEmailLimpo.includes(inputEmail) || inputEmail.includes(leadEmailLimpo);

            if (cnpjBate || emailBate) {
                leadEncontrado = leadCandidato;
            }
        }
    }

    // 2. Se não encontrou pelo ID ou não veio ID, procura em todos os leads por CNPJ e E-mail
    if (!leadEncontrado) {
        leadEncontrado = leadsLista.find(l => {
            const lCnpj = (l.cnpj || '').replace(/\D/g, '');
            const lEmail = (l.email || '').trim().toLowerCase();

            const matchCnpj = cnpjDigitos && lCnpj && (cnpjDigitos === lCnpj);
            const matchEmail = inputEmail && lEmail && (inputEmail === lEmail || lEmail.includes(inputEmail));

            return matchCnpj && matchEmail;
        });

        // 3. Fallback: procura apenas por CNPJ exato
        if (!leadEncontrado && cnpjDigitos.length >= 8) {
            leadEncontrado = leadsLista.find(l => {
                const lCnpj = (l.cnpj || '').replace(/\D/g, '');
                return lCnpj && (lCnpj === cnpjDigitos || lCnpj.slice(0, 8) === cnpjDigitos.slice(0, 8));
            });
        }
    }

    if (!leadEncontrado) {
        if (errEl) {
            errEl.innerHTML = 'Credenciais não localizadas.<br><span style="font-size:12px;font-weight:400;opacity:0.9;">Verifique o e-mail e o CNPJ digitados ou contate seu consultor MiCRO: Fernando Feitosa (19) 98440-0195.</span>';
            errEl.style.display = 'block';
        }
        return;
    }

    // Sucesso na autenticação!
    iniciarSessaoPortalCliente(leadEncontrado, true);
}

function iniciarSessaoPortalCliente(lead, registrarAcesso = true) {
    leadClienteAutenticado = lead;

    sessionStorage.setItem('crm_cliente_sessao', JSON.stringify({
        leadId: lead.id,
        empresa: lead.empresa,
        email: lead.email,
        loginEm: new Date().toISOString()
    }));

    if (registrarAcesso) {
        lead.landingPageViews = (lead.landingPageViews || 0) + 1;
        lead.landingPageUltimoAcesso = new Date().toISOString();

        if (!lead.historico) lead.historico = [];
        lead.historico.push({
            id: 'h_' + Date.now(),
            data: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            tipo: 'Portal / Landing Page',
            descricao: `Cliente ${lead.empresa} acessou a Landing Page pelo portal (visualização #${lead.landingPageViews}).`,
            usuario: 'Cliente (Portal)'
        });

        if (typeof salvarDados === 'function') salvarDados();
        if (typeof salvarLeadNoBanco === 'function') salvarLeadNoBanco(lead);
    }

    // Oculta telas de login e exibe a Landing Page
    const portalLogin = document.getElementById('clientePortalLoginScreen');
    const crmLogin = document.getElementById('loginScreen');
    const appWrapper = document.getElementById('appWrapper');
    const portalView = document.getElementById('clientePortalView');
    const iframe = document.getElementById('clienteLandingPageIframe');
    const nomeEmpresaTopo = document.getElementById('clientePortalTopoEmpresa');

    if (portalLogin) portalLogin.style.display = 'none';
    if (crmLogin) crmLogin.style.display = 'none';
    if (appWrapper) appWrapper.style.display = 'none';

    if (nomeEmpresaTopo) nomeEmpresaTopo.textContent = lead.empresa;

    if (portalView) portalView.style.display = 'block';

    if (iframe) {
        const rendered = renderizarLandingPageJIT(lead.landingPageModeloId, lead);
        iframe.srcdoc = rendered;
    }
}

function sairPortalCliente() {
    sessionStorage.removeItem('crm_cliente_sessao');
    leadClienteAutenticado = null;
    const portalView = document.getElementById('clientePortalView');
    if (portalView) portalView.style.display = 'none';

    // Se estiver com query param, limpa a query ou volta ao login do portal
    if (window.location.search.includes('lp=') || window.location.search.includes('portal=')) {
        window.location.href = window.location.pathname;
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
    }
}

function voltarAoLoginCrmColaborador() {
    sessionStorage.removeItem('crm_cliente_sessao');
    const portalLogin = document.getElementById('clientePortalLoginScreen');
    const portalView = document.getElementById('clientePortalView');
    const crmLogin = document.getElementById('loginScreen');

    if (portalLogin) portalLogin.style.display = 'none';
    if (portalView) portalView.style.display = 'none';
    if (crmLogin) crmLogin.style.display = 'flex';
}

// Inicializa modelos se ainda não inicializado
inicializarModelosLandingPageExemplo();
