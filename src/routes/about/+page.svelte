<script>
  import { MetaTags } from "$lib/components";
  import { getLocale } from "$lib/paraglide/runtime";
</script>

<svelte:head>
  <MetaTags title="About" description="Lithuania underground scene" />
</svelte:head>

<h1>Lithuania underground scene</h1>

{#if getLocale() === "lt"}
  <ul>
    <li>
      <a href="https://mp3.hardcore.lt"
        >Muzikos archyvas: nuo pirmų pankroko įrašų kasetėje, iki dabar</a
      >
    </li>
  </ul>

  <h2>Vilnius</h2>
  <p>
    Paslaptingoji driskių skylė <strong
      ><a href="https://oldschool.hardcore.lt/xi20/xi20.html">XI20</a></strong
    >.
  </p>
  <p>
    Jei nori pasirodyti su grupe, rašyk: <strong>1120 (A) hardcore.lt</strong>
  </p>
  <p>
    Pasiklydai, ieškai kaip ateiti? - Klausk pažįstamų pankų, arba rašyk <strong
      >tourist (A) hardcore.lt</strong
    >
  </p>
  <p>
    <a href="https://instagram.com/retrito.smarsas">RETRITO SMARSAS</a> - DIY erdvė
    menininkams
  </p>
  <p>
    <a href="https://kirtimukc.lt">Kirtimų Kultūros Centras</a> - dažnai
    vykstantys nišiniai garso meno ir muzikos koncertai. Susisiek su jais, jei
    groji noise arba folk muziką:
    <strong>renginiai (A) kirtimukc.lt</strong>
  </p>
  <p>
    <a href="https://www.facebook.com/pg/facialtumourbooking/about/"
      >Facial Tumour Booking</a
    > - underground muzikos booking crew
  </p>
  <h2>Kaunas</h2>
  <p>
    Metalistų/"apolitiškas" baras <a
      href="https://www.facebook.com/LemmyKlubasKaunas/">Lemmy</a
    >
  </p>
  <h2>Alytus</h2>
  <p>
    <strong
      ><a
        href="http://www.facebook.com/groups/259810918716/"
        target="_blank"
        rel="noopener">Fenix baras</a
      ></strong
    >
  </p>
  <h2>Aplink pasaulį</h2>
  <p>
    Gidas apie underground vietas, koncertų organizatorius ir pan. Rytų
    Europoje, kurį parengė noise-guru Arma: <a
      href="http://www.arma.lt/p/geography-of-sound.html"
      >http://www.arma.lt/p/geography-of-sound.html</a
    >
  </p>
  <p class="align-right"><em>Atnaujinta: Lapkritis 2020</em></p>
{:else if getLocale() === "fi"}
  <ul>
    <li>
      <a href="https://mp3.hardcore.lt">
        Musiikkiarkisto: ensimmäisestä kasetille äänitetystä punkista tähän
        päivään
      </a>
    </li>
  </ul>

  <h2>Vilna</h2>
  <p>
    "Se" tee-se-itse -underground-tila on
    <strong
      ><a href="https://oldschool.hardcore.lt/xi20/xi20.html">XI20</a></strong
    >. Punkista avantgarde-jazziin, hardcoresta noiseen.
  </p>
  <p>
    Jos haluat soittaa XI20:ssa bändisi kanssa, ota yhteyttä:
    <strong>1120 (A) hardcore.lt</strong>
  </p>
  <p>
    Myös matkaajat ovat tervetulleita: kysy paikallisilta miten löytää paikka
    tai jos olet epätoivoinen, kysy ohjeita osoitteesta
    <strong>tourist (A) hardcore.lt</strong>
  </p>
  <p>
    Siistimpään ja taiteellisempaan meininkiin tsekkaa
    <a href="https://instagram.com/retrito.smarsas">RETRITO SMARSAS</a>
  </p>
  <p>
    <a href="https://kirtimukc.lt">KKC</a> eli Kirtimų Kultūros Centras on
    kaupungin pyörittämä kulttuurikeskus, jota vetävät innostuneet ihmiset. Ota
    heihin yhteyttä jos teet noisea tai kansanmusiikkia:
    <strong>renginiai (A) kirtimukc.lt</strong>
  </p>
  <p>
    <a href="https://www.facebook.com/pg/facialtumourbooking/about/">
      Facial Tumour Booking
    </a> – keikkajärkkäritiimi synkälle underground-musiikille
  </p>

  <h2>Kaunas</h2>
  <p>
    Metallipainotteinen/"epäpoliittinen" paikka
    <a href="https://www.facebook.com/LemmyKlubasKaunas/">Lemmy</a>
  </p>

  <h2>Alytus</h2>
  <p>
    Siellä on <strong>
      <a
        href="http://www.facebook.com/groups/259810918716/"
        target="_blank"
        rel="noopener"
      >
        Fenix-baari
      </a>
    </strong>
  </p>

  <h2>Maailma</h2>
  <p>
    Itä-Euroopan underground-tilojen, promoottoreiden jne. opas noise-guru Arman
    kokoamana:
    <a href="http://www.arma.lt/p/geography-of-sound.html">
      http://www.arma.lt/p/geography-of-sound.html
    </a>
  </p>

  <p class="align-right"><em>viimeksi päivitetty: marraskuu 2020</em></p>
{:else}
  <ul>
    <li>
      <a href="https://mp3.hardcore.lt"
        >Music archive: since first tape-recorded punk till now</a
      >
    </li>
  </ul>

  <h2>Vilnius</h2>
  <p>
    "The" DIY underground venue is <strong
      ><a href="https://oldschool.hardcore.lt/xi20/xi20.html">XI20</a></strong
    >. From punk to vanguard jazz, hardcore to noise.
  </p>
  <p>
    If you want to play at XI20 with your band please contact: <strong
      >1120 (A) hardcore.lt</strong
    >
  </p>
  <p>
    Travellers are also welcome: ask locals how to find the place or if you are
    desperate ask for directions at <strong>tourist (A) hardcore.lt</strong>
  </p>
  <p>
    For cleaner artsier vibes check out <a
      href="https://instagram.com/retrito.smarsas">RETRITO SMARSAS</a
    >
  </p>
  <p>
    <a href="https://kirtimukc.lt">KKC</a> aka Kirtimų Kultūros Centras is a
    city-run cultural center staffed by enthusiastic people. Get in touch with
    them if you're noise or folk act:
    <strong>renginiai (A) kirtimukc.lt</strong>
  </p>
  <p>
    <a href="https://www.facebook.com/pg/facialtumourbooking/about/"
      >Facial Tumour Booking</a
    > -- booking crew for dark underground music
  </p>
  <h2>Kaunas</h2>
  <p>
    Metalhead/"apolitical" venue <a
      href="https://www.facebook.com/LemmyKlubasKaunas/">Lemmy</a
    >
  </p>
  <h2>Alytus</h2>
  <p>
    There is a <strong
      ><a
        href="http://www.facebook.com/groups/259810918716/"
        target="_blank"
        rel="noopener">Fenix bar</a
      ></strong
    >
  </p>
  <h2>World</h2>
  <p>
    There’s a guide to underground venues/promoters/etc in Eastern Europe, made
    by the noise-guru Arma: <a
      href="http://www.arma.lt/p/geography-of-sound.html"
      >http://www.arma.lt/p/geography-of-sound.html</a
    >
  </p>
  <p class="align-right"><em>last update: November 2020</em></p>
{/if}

<style>
  h2 {
    margin-top: 1em;
    margin-bottom: 0;
  }
</style>
