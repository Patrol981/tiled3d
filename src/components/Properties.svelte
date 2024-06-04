<script lang="ts">
  import { isPropertiesTabOpen } from "../store/propertiesStore";

  let expanded = false;

  isPropertiesTabOpen.subscribe((value) => {
    expanded = value;
  });
</script>

{#if expanded}
  <div></div>
{/if}

<style scoped>
  div {
    position: absolute;

    width: 30vw;
    height: 100vh;

    right: 0;
    top: 0;

    background-color: rgba(47, 47, 47, 0.6);
  }
</style>
