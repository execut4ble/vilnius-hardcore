<script lang="ts">
  let {
    title = "Vilnius Hardcore",
    description = "skapunkrastafunk scene in Vilnius, Lithuania",
    image = "https://hardcore.lt/favicon.png",
  } = $props();
</script>

<title>{title}</title>
<meta name="description" content={description} />
<meta
  name="keywords"
  content="Vilnius, Lithuania, ska, punk, rasta, funk, scene, events, calendar"
/>

<meta property="og:url" content="https://hardcore.lt" />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />

<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="hardcore.lt" />
<meta property="twitter:domain" content="hardcore.lt" />
<meta property="twitter:url" content="https://hardcore.lt" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={image} />
