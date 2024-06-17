<script lang="ts">
  import { propertiesData } from "../store/propertiesStore";

  let ySize = 255;

  propertiesData.subscribe((value) => {
    ySize = value.modelProperties[0].ySize;
  });

  function setSize() {
    propertiesData.update((properties) => {
      properties.modelProperties[0].ySize = ySize;

      return properties;
    });
  }
</script>

<div class="main">
  <input type="number" name="" id="" on:change={setSize} bind:value={ySize} />
</div>

<style scoped>
</style>
