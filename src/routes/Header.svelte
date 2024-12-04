<script lang="ts">
  import figlet from "figlet";
  import graffiti from "figlet/importable-fonts/Graffiti.js";

  figlet.parseFont("Graffiti", graffiti);

  const welcomeTitle = $state(figlet.textSync("hardcore.lt", "Graffiti"));
  const description = $state("Ska funk rasta punk scene, vilnius, lithuania");
</script>

<header>
  <figlet><pre>{welcomeTitle}</pre></figlet>
  <div class="description">
    <span>{description}</span><span class="cursor">&nbsp;</span>
  </div>
</header>

<style>
  header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  figlet pre {
    color: var(--color-text-2);
    background-color: rgba(0, 0, 0, 0);
    margin-bottom: 0;
    font-weight: 800;
  }

  .description {
    text-transform: uppercase;
  }

  .cursor {
    display: inline-block;
    background: #111;
    margin-left: 1px;

    -webkit-animation: blink 2s linear 0s infinite;
    -moz-animation: blink 2s linear 0s infinite;
    -ms-animation: blink 2s linear 0s infinite;
    -o-animation: blink 2s linear 0s infinite;
    animation: blink 2s linear 0s infinite;
  }

  @keyframes blink {
    0% {
      background: var(--color-text);
    }
    47% {
      background: var(--color-text-2);
    }
    50% {
      background: #000;
    }
    97% {
      background: #000;
    }
    100% {
      background: var(--color-text-2);
    }
  }
  @-webkit-keyframes blink {
    0% {
      background: var(--color-text);
    }
    47% {
      background: var(--color-text-2);
    }
    50% {
      background: #000;
    }
    97% {
      background: #000;
    }
    100% {
      background: var(--color-text-2);
    }
  }

  @-moz-keyframes blink {
    0% {
      background: var(--color-text);
    }
    47% {
      background: var(--color-text-2);
    }
    50% {
      background: #000;
    }
    97% {
      background: #000;
    }
    100% {
      background: var(--color-text-2);
    }
  }

  @-ms-keyframes blink {
    0% {
      background: var(--color-text);
    }
    47% {
      background: var(--color-text-2);
    }
    50% {
      background: #000;
    }
    97% {
      background: #000;
    }
    100% {
      background: var(--color-text-2);
    }
  }

  @-o-keyframes blink {
    0% {
      background: var(--color-text);
    }
    47% {
      background: var(--color-text-2);
    }
    50% {
      background: #000;
    }
    97% {
      background: #000;
    }
    100% {
      background: var(--color-text-2);
    }
  }
</style>
