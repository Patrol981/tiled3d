<script lang="ts">
  import { isPropertiesTabOpen } from "../store/propertiesStore";

  let expanded = false;

  isPropertiesTabOpen.subscribe((value) => {
    expanded = value;
  });
</script>

{#if expanded}
  <div class="properties_menu">
    <h1>Properties</h1>
    <div class="menu_field">
      <h2>Project Name</h2>
      <input id="project_name" type="text" />
    </div>

    <div class="menu_field">
      <h2>Selected mesh data</h2>
      <div class="menu_option">
        <input type="range" value="5" min="0" max="10" step="1" name="" id="" />
      </div>
    </div>
  </div>
{/if}

<style scoped>
  .properties_menu {
    position: absolute;

    width: 30vw;
    height: 100vh;

    right: 0;
    top: 0;

    background-color: rgba(47, 47, 47, 0.6);
  }

  .menu_field {
    display: block;

    text-align: justify;
  }
</style>
