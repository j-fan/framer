<script lang="ts">
  let imgSrc = '';
  let files: FileList | undefined = undefined;
  $: hasFile = files && files.length;

  // This effect is called upon image upload
  // It sets the uploaded image as the new image
  $: {
    if (files && files.length) {
      imgSrc = URL.createObjectURL(files[0]);
    }
  }

  const removeFile = () => {
    URL.revokeObjectURL(imgSrc);
    imgSrc = '';
    files = undefined;
  };
</script>

<div class="frame" class:has-border={!hasFile}>
  <img src={imgSrc} alt="" />
  <div class="overlay">
    {#if hasFile}
      <button class="remove-button" type="button" on:click={removeFile}>X</button>
    {:else}
      <label for="file-upload" class="custom-file-input">Upload image</label>
      <input
        id="file-upload"
        bind:files
        type="file"
        accept="image/png, image/jpeg"
        class="file-input"
      />
    {/if}
  </div>
</div>

<style>
  .frame {
    aspect-ratio: 4 / 5;
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
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
  }

  .remove-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
</style>
