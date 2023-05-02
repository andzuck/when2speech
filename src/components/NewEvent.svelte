<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</svelte:head>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossorigin="anonymous">
  import { storedData, currentUser, currentEvent, eventProperties } from '../stores.js';
  let eventName = '';
	let dateRange = '';
	let timeZone = '-05:00';

  // Validation/Submission from https://svelte.dev/repl/5230b1d71f1b4b048cf05e3a7a49aefc?version=3.24.0
  import {fly, fade } from 'svelte/transition';
  import jQuery from 'jquery';
  import { onMount } from 'svelte';
	let hasError = false;
	let isSuccessVisible = false;
	let submitted = false;
	
	const errMessage = "Please fill out all fields.";	
	
  // const datepicker = jQuery('#date-range');
  onMount(() => {
    const datepicker = document.getElementById('date-range');
    console.log(datepicker);
    datepicker.addEventListener('selectDate', function(event) {
      dateRange = event.detail;
    });
  });

	function handleSubmit(e) {
    console.log(eventName);
    console.log(dateRange);
    console.log(timeZone);

    // state of sharing mechanism event concept: event created or has errors?
		
    if (!eventName || !dateRange || dateRange.length == 0 || !timeZone) {
      hasError = true;
    }
    else {
      hasError = false;
      if (submitted) {
        // action for sharing mechanism concept: ensure event code uniqueness
        let eventID = Math.random().toString(36).substring(2,7).toUpperCase();
        while (eventID in $storedData) {
          eventID = Math.random().toString(36).substring(2,7).toUpperCase();
        }
        currentEvent.set(eventID);
        console.log("in handle submit");
        // properties of sharing mechanism event concept: time zone, date range
        eventProperties.set(Object.assign({}, {[eventID]: {timeZone: timeZone, dateRange: dateRange, eventName: eventName}}, $eventProperties))
        console.log($eventProperties);console

        location.href = "/" + eventID;
      }
    }
	}
</script>
<head>
  <script
    type="module"
    src="https://cdn.jsdelivr.net/npm/inclusive-dates/dist/esm/inclusive-dates.js"
  />

  <!-- Loading the theme is optional. -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/inclusive-dates/dist/themes/light.css"
  />
</head>

<main>
    <h1>Create New Event</h1>
    <form class:submitted on:submit|preventDefault={handleSubmit}>
    <div class="form-element">
        <div><label for="event-name" alt="required"><h2>Event Name</h2></label></div>
        <!-- property of sharing mechanism event concept: event name, used to generate unique event code -->
        <input class="form-control" required aria-required=”true” id="event-name" bind:value={eventName} oninvalid="this.setCustomValidity('Please enter event name.')" oninput="setCustomValidity('')">
    </div>
    <div class="form-element">
        <div><label for="date-range"><h2>Choose a Date Range</h2></label></div>
        <!-- property of sharing mechanism event concept: date range -->
        <inclusive-dates id="date-range" range label="Choose a date range" placeholder="Try &quot;June 8 to 12&quot;" show-today-button locale="en-US" disabled="false" input-should-format="input-should-format" show-month-stepper show-clear-button></inclusive-dates>
    </div>
    <button type="submit" class="btn btn-primary btn-lg" on:click={() => submitted = true}>Create Event</button>
    {#if hasError == true}
        <p class="error-alert">{errMessage}</p>
    {/if}
    </form>
  </main>

<style>
  .form-element {
    padding: 25px 0px;
  }

  :global(.inclusive-dates__input-container) {
    margin: auto;
  }

  :global(.inclusive-dates__label) {
    visibility: hidden;
    height: 0px;
    margin: 0px
  }

  #event-name {
    max-width: 250px;
    margin: auto;
  }

  .submitted input:invalid {
		border: 1px solid #c00;
	}

	.submitted input:focus:invalid {
		outline: 1px solid #c00;
	}
	
	.error-alert {
		border: 1px solid #c00 !important;
		padding: 6px;
		text-align: center;
		color: #c00;
		border-radius: 3px;
	}
</style>