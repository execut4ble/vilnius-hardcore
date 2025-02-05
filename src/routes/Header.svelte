<script lang="ts">
  const description: string = $state(
    "Ska funk rasta punk scene, vilnius, lithuania",
  );
</script>

<header>
  <figlet
    ><pre>    .__                     .___                            .__   __   
    |  |__ _____ _______  __| _/____  ___________   ____    |  |_/  |_ 
    |  |  \\__  \\_  __ \/ __ |/ ___\/  _ \_  __ \_/ __ \   |  |\   __\
    |   Y  \/ __ \|  | \/ /_/ \  \__(  &lt_&gt )  | \/\  ___/   |  |_|  |  
    |___|  (____  /__|  \____ |\___  &lt____/|__|    \___  &gt /\____/__|  
         \/     \/           \/    \/                  \/  \/</pre></figlet
  >
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
    margin-top: 0;
    color: var(--color-text-2);
    background-color: rgba(0, 0, 0, 0);
    margin-bottom: 0;
    font-weight: 800;
    box-shadow: none;
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
      background: #111;
    }
    97% {
      background: #111;
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
      background: #111;
    }
    97% {
      background: #111;
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
      background: #111;
    }
    97% {
      background: #111;
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
      background: #111;
    }
    97% {
      background: #111;
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
      background: #111;
    }
    97% {
      background: #111;
    }
    100% {
      background: var(--color-text-2);
    }
  }

  @media screen and (max-width: 850px) {
    figlet pre {
      font-size: 1.85vw;
    }
  }

  @media screen and (max-width: 450px) {
    header .description {
      font-size: 3vw;
    }
  }
</style>
