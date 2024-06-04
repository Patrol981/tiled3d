<script lang="ts">
  import { sineInOut } from "svelte/easing";
  import { fade, scale } from "svelte/transition";
  import { isPropertiesTabOpen } from "../store/propertiesStore";

  let expanded = false;

  let propertiesExpanded = false;

  isPropertiesTabOpen.subscribe((value) => {
    propertiesExpanded = value;
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  id="expanded"
  on:mouseenter={() => {
    expanded = true;
  }}
  on:mouseleave={() => {
    expanded = false;
  }}
>
  {#if expanded}
    <span
      transition:scale={{
        duration: 100,
        delay: 0,
        opacity: 0,
        start: 0,
        easing: sineInOut,
      }}
    >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        role="button"
        tabindex="0"
        on:click={() => {
          isPropertiesTabOpen.set(!propertiesExpanded);
        }}
      >
        <img src="right_panel.svg" alt="" />
      </a>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a>
        <img src="upload.svg" alt="" />
      </a>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a>
        <img src="download.svg" alt="" />
      </a>
    </span>
  {:else}
    <span id="collapsed">
      <img src="expand.svg" alt="" />
    </span>
  {/if}
</div>

<style scoped>
  div {
    position: absolute;
    bottom: 1%;
    left: 50%;

    width: fit-content;
    height: 5vh;

    transform: translateX(-50%);

    background-color: rgba(47, 47, 47, 0.5);
    border-radius: 24px;

    overflow-y: hidden;
  }

  div:hover {
    width: fit-content;
  }

  div span {
    display: flex;
    justify-content: center;
    align-items: center;
    row-gap: auto;
    height: 100%;
  }

  div a {
    height: 100%;
  }

  div img {
    height: 100%;
    width: auto;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  div a:hover {
    cursor: pointer;
    filter: invert(20%) sepia(57%) saturate(4241%) hue-rotate(350deg)
      brightness(94%) contrast(89%);
  }
</style>
