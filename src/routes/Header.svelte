<script lang="ts">
  import Logo from "$lib/images/logo.gif?enhanced";
  const description: string = $state(
    "Ska funk rasta punk scene, Vilnius, Lithuania",
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
  <enhanced:img src={Logo} alt={description} />
</header>

<style>
  :global(html.dark) {
    figlet,
    header .description {
      display: inherit;
    }

    header img {
      display: none;
    }
  }

  :global(html) {
    figlet,
    header .description {
      display: none;
    }
  }

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
    background: var(--color-bg);
    margin-left: 1px;

    -webkit-animation: blink 2s linear 0s infinite;
    -moz-animation: blink 2s linear 0s infinite;
    -ms-animation: blink 2s linear 0s infinite;
    -o-animation: blink 2s linear 0s infinite;
    animation: blink 2s linear 0s infinite;
  }

  @keyframes blink {
    0% {
      background: var(--color-text-2);
    }
    47% {
      background: var(--color-text-2);
    }
    50% {
      background: var(--color-bg);
    }
    97% {
      background: var(--color-bg);
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
