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
    <div class="form-element">
        <div><label for="time-zone-offset"><h2>Time Zone</h2></label></div>
        <!-- Taken from https://gist.github.com/nodesocket/3919205 -->
        <!-- property of sharing mechanism event concept: time zone -->
        <select name="timezone_offset" required id="timezone-offset" class="span5" bind:value={timeZone}>
            <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
            <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
            <option value="-10:00">(GMT -10:00) Hawaii</option>
            <option value="-09:50">(GMT -9:30) Taiohae</option>
            <option value="-09:00">(GMT -9:00) Alaska</option>
            <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
            <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
            <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
            <option value="-05:00" selected="selected">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
            <option value="-04:50">(GMT -4:30) Caracas</option>
            <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
            <option value="-03:50">(GMT -3:30) Newfoundland</option>
            <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
            <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
            <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
            <option value="+00:00">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
            <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
            <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
            <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
            <option value="+03:50">(GMT +3:30) Tehran</option>
            <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
            <option value="+04:50">(GMT +4:30) Kabul</option>
            <option value="+05:00">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
            <option value="+05:50">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
            <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
            <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
            <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
            <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
            <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
            <option value="+08:75">(GMT +8:45) Eucla</option>
            <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
            <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
            <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
            <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
            <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
            <option value="+11:50">(GMT +11:30) Norfolk Island</option>
            <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
            <option value="+12:75">(GMT +12:45) Chatham Islands</option>
            <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
            <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
        </select>
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