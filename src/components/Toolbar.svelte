<script lang="ts">
  import { sineInOut } from "svelte/easing";
  import { fade, scale } from "svelte/transition";

  const animate = (node: any, args: any) =>
    args.cond ? fade(node, args) : scale(node, args);

  let expanded = false;
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
      <img src="right_panel.svg" alt="" />
      <img src="upload.svg" alt="" />
      <img src="download.svg" alt="" />
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

  div img {
    height: 90%;
    width: auto;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  div img:hover {
    cursor: pointer;
    filter: invert(20%) sepia(57%) saturate(4241%) hue-rotate(350deg)
      brightness(94%) contrast(89%);
  }
</style>
