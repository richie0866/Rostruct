---
hide:
  - navigation
  - toc
---

<style>
	.hero-body {
		background: url('images/backdrop-gradient.svg'), linear-gradient(
			170deg,
			#02A6F2 25%,
			hsla(280, 67%, 55%, 1) 60%,
			var(--md-default-bg-color) 99%
		);
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed;
	}

	.landing-header {
		padding-top: 100px;
		width: 620px;
		max-width: 75%;
		margin: auto;
	}

	.landing-header-logo {
		width: 128px;
		min-width: 50%;
		max-width: 80%;
		margin: auto;
	}
		
	.landing-headline {
		color: white;
		font-weight: 700;
	}
</style>

<body class="hero-body">
	<div class="landing-header" align="center">
		<img
			class="landing-header-logo"
			src="images/Rostruct.svg"
			alt="Rostruct logo"
			draggable="false"
		></img>
		<h1><span class="landing-headline">Rostruct</span></h1>
		<p>{{ config.site_description }}.</p>
		<p>Manage your Lua projects using professional-grade tools to easily run, test, and publish your code. Deploy your project files to a Roblox script executor with a simple and flexible execution library.</p>
		<a
			href="{{ page.next_page.url }}"
			title="{{ page.next_page.title }}"
			class="md-button md-button--primary"
		>
			Quick start
		</a>
		&nbsp;
		<a
			href="https://github.com/richie0866/Rostruct/"
			title="Github repository"
			class="md-button"
		>
			Github
		</a>
	</div>
</body>
