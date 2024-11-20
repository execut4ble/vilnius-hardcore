<script lang="ts">
  import figlet from "figlet";
  import graffiti from "figlet/importable-fonts/Graffiti.js";

  figlet.parseFont("Graffiti", graffiti);

  const welcomeTitle = $state(figlet.textSync("hardcore.lt", "Graffiti"));
  const description = $state("Ska funk rasta punk scene, vilnius, lithuania");
</script>

<header>
  <span class="welcome figlet"><pre>{welcomeTitle}</pre></span>
  <div class="description">
    <span class="dim">{description}</span><span class="cursor">&nbsp;</span>
  </div>
</header>

<style>
  header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .welcome.figlet pre {
    color: #0f0;
    background-color: rgba(0, 0, 0, 0);
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
  }

  @-webkit-keyframes blink {
    0% {
      background: #0a0;
    }
    47% {
      background: #090;
    }
    50% {
      background: #000;
    }
    97% {
      background: #000;
    }
    100% {
      background: #090;
    }
  }

  @-moz-keyframes blink {
    0% {
      background: #0a0;
    }
    47% {
      background: #090;
    }
    50% {
      background: #000;
    }
    97% {
      background: #000;
    }
    100% {
      background: #090;
    }
  }

  @-ms-keyframes blink {
    0% {
      background: #0a0;
    }
    47% {
      background: #090;
    }
    50% {
      background: #000;
    }
    97% {
      background: #000;
    }
    100% {
      background: #090;
    }
  }

  @-o-keyframes blink {
    0% {
      background: #0a0;
    }
    47% {
      background: #090;
    }
    50% {
      background: #000;
    }
    97% {
      background: #000;
    }
    100% {
      background: #090;
    }
  }
</style>
