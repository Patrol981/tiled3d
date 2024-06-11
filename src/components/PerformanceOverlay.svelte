<script lang="ts">
  import type { WebGPUMemoryInfo } from "../lib/utils/memory";
  import { perfInfo } from "../store/engineStore";
  import { bytesToMB } from "../lib/utils/bytes";

  let info: WebGPUMemoryInfo;

  perfInfo.subscribe((value) => {
    info = value;
  });
</script>

<div class="main">
  {#if info != undefined}
    <div class="column">
      <h1>Resources</h1>
      {#each Object.entries(info.resources) as [title, value]}
        <p>{title} : {value}</p>
      {/each}
    </div>
    <div class="column">
      <h1>Memory</h1>
      {#each Object.entries(info.memory) as [title, value]}
        <p>{title} : {bytesToMB(value)}MB</p>
      {/each}
    </div>
  {/if}
</div>

<style scoped>
  .main {
    position: absolute;
    right: 0;
    bottom: 0;

    overflow-y: scroll;

    width: 50vw;
    height: 50vh;

    background-color: rgba(47, 47, 47, 0.4);

    display: flex;
    flex-direction: row;
  }

  .column {
    width: 50%;
    display: block;

    text-align: justify;
    text-indent: 5%;
    margin: 0;
    padding: 0;
  }

  .column h1 {
    margin: 0;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    padding: 0;
  }

  .column p {
    margin: 0;
    padding: 0;
  }
</style>
