<script lang="ts">
  export let aspectRatio = '4 / 5';

  let imgSrc = '';
  let files: FileList | undefined = undefined;

  let frameRef: HTMLDivElement;
  let frameWidth = 1;
  let isDragging = false;
  let mouseDownX = 0;
  let mouseDownY = 0;
  let elePosX = 0;
  let elePosY = 0;
  let bgPercentX = 0;
  let bgPercentY = 0;

  $: hasFile = files && files.length;

  // This effect is called upon image upload
  // It sets the uploaded image as the new image
  $: {
    if (files && files.length) {
      // Temporary image variable used to measure dimensions
      const tempImage = new Image();

      imgSrc = URL.createObjectURL(files[0]);

      tempImage.src = imgSrc;
      tempImage.onload = () => {
        frameWidth = tempImage.width;
      };
    }
  }

  const removeFile = () => {
    URL.revokeObjectURL(imgSrc);
    imgSrc = '';
    files = undefined;
  };

  const startDrag = (x: number, y: number) => {
    elePosX = bgPercentX;
    elePosY = bgPercentY;

    mouseDownX = x;
    mouseDownY = y;
    isDragging = true;
  };

  const updateDrag = (currentX: number, currentY: number) => {
    if (!isDragging) {
      return;
    }

    const movePercentageX = (100 * (currentX - mouseDownX)) / 100;
    const movePercentageY = (100 * (currentY - mouseDownY)) / 100;

    if (currentX !== mouseDownX && currentY !== mouseDownY) {
      bgPercentX = elePosX + movePercentageX;
      bgPercentY = elePosY + movePercentageY;
    }
  };

  const handleMouseStart = (e: MouseEvent) => {
    startDrag(e.pageX, e.pageY);
  };

  const handleTouchStart = (e: TouchEvent) => {
    startDrag(e.touches[0].pageX, e.touches[0].pageY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    updateDrag(e.pageX, e.pageY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    updateDrag(e.touches[0].pageX, e.touches[0].pageY);
  };

  const handleMoveEnd = () => {
    isDragging = false;
  };
</script>

<!-- <div>{movePercentX} {movePercentY}</div> -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={frameRef}
  class="frame"
  class:has-border={!hasFile}
  style="background-image: url({imgSrc}); aspect-ratio: {aspectRatio}; background-position: {bgPercentX}% {bgPercentY}%;"
  on:mousedown={handleMouseStart}
  on:touchstart={handleTouchStart}
  on:mousemove={handleMouseMove}
  on:touchmove={handleTouchMove}
  on:mouseup={handleMoveEnd}
  on:touchend={handleMoveEnd}
>
  <div class="overlay">
    {#if hasFile}
      <button class="remove-button" type="button" on:click={removeFile}>X</button>
    {:else}
      <label for="file-upload" class="custom-file-input">Upload image</label>
      <input id="file-upload" bind:files type="file" accept="image/*" class="file-input" />
    {/if}
  </div>
</div>

<style>
  .frame {
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .has-border {
    border: 1px dashed black;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-input {
    display: none;
  }

  .custom-file-input,
  .remove-button {
    border: 1px solid black;
    border-radius: 1rem;
    padding: 4px 8px;
    cursor: pointer;
    background: transparent;
    min-width: 34px;
    color: black;
  }

  .remove-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
</style>
