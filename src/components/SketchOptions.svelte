<script lang="ts">
  import ExpandView from "./ExpandView.svelte";

  let expandViewOpen = false;
</script>

<div class="menu">
  <div class="menu_option">
    <button>
      <img src="drag_pan.svg" alt="" />
    </button>
  </div>
  <div class="menu_option">
    <button>
      <img src="cursor_click.svg" alt="" />
    </button>
  </div>
  <div class="menu_option">
    <button
      on:click={() => {
        expandViewOpen = !expandViewOpen;
      }}
    >
      <img src="expand_vert.svg" alt="" />
    </button>
  </div>

  {#if expandViewOpen}
    <ExpandView />
  {/if}
</div>

<style scoped>
  .menu {
    position: absolute;
    left: 50.25vw;
    bottom: 50.5vh;
  }

  .menu button {
    width: min-content;
    height: min-content;

    margin-top: 0.5rem;

    border-radius: 14px;
    border: 1px solid transparent;
    padding: 0.3em 0.3em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    /*
      background-color: rgba(26, 26, 26, 0.3);
    */
    background-color: rgba(220, 99, 71, 0.7);
    cursor: pointer;
    transition: border-color 0.05s;

    display: flex;
    vertical-align: middle;
    justify-content: center;
    align-items: center;
  }

  .menu button img {
    height: 100%;
    width: auto;
  }

  .menu button:hover {
    border-color: #c9c9c9;
  }

  .menu button:focus,
  .menu button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>
