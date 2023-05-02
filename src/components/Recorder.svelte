<svelte:head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</svelte:head>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossorigin="anonymous">
    // used https://github.com/karkranikhil/voice-notes to learn how to use web speech api in svelte
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
  
    let isActive = false;
    function playHandler() {
      isActive = !isActive;
    }
  
    function iconHandler(type) {
      if (type === "PLAY" || type === "PAUSE") {
        isActive = !isActive;
      }
      let actionType =
        type === "PLAY" && isActive
          ? "PLAY"
          : type === "PLAY" && !isActive
          ? "PAUSE"
          : type;
      // console.log(actionType);
      dispatch("recorderHandler", {
        actionType: actionType
      });
    }
</script>

<div>
    <button class="btn btn-primary btn-sm mb-2" border="2px solid black" background-color="orange" on:click={() => iconHandler('PLAY')}>{isActive ? 'Stop Record' : 'Record'}</button>
    <!-- <button on:click={() => iconHandler('RESET')}>RESET</button> -->
    <!-- <button on:click={() => iconHandler('SAVE')}>SAVE</button>  -->
    {#if isActive}
      <p>Recording...</p>
    {/if}
  
</div>