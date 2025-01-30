<script lang="ts">
  import '../app.css';

  const title = 'Framer';
  const description = `Frames your photos for instagram`;
  const socialMediaImage = 'https://framer-two-jade.vercel.app/icon/icon-512x512.png';
  const websiteLink = 'https://framer-two-jade.vercel.app/';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Primary Meta Tags -->
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={websiteLink} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={socialMediaImage} />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={websiteLink} />
  <meta property="twitter:title" content="Chi Fan" />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={socialMediaImage} />
</svelte:head>

<main>
  <slot />
</main>

<style>
  main {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
