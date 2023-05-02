<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</svelte:head>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossorigin="anonymous">
	import VoiceRecognition from './VoiceRecognition.svelte'
	import TimeZoneSelect from './TimeZoneSelect.svelte'
	import {processText, makeTimeArr, getTopNIntervals} from '../helpers.js';
	import Table from './Table.svelte';
	import { storedData, currentUser, currentEvent, eventProperties } from '../stores.js';

	const dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	export let eventID;
	let name = '';
	let text = '';
	let loading = false;
	let availableTimes = null;
	let API_BASE = 'http://localhost:3001';
	import accessibleDate from 'accessible-date';
	let presubmitted = false;
	let editedAfterPresubmit = false;

	// Create Event Date Range String + Accessible String
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const startDate = new Date($eventProperties[eventID].dateRange[0]);
	const endDate = new Date($eventProperties[eventID].dateRange[1]);
	let dateRangeString = months[startDate.getMonth()] + " " + startDate.getDate() + " " + startDate.getFullYear();
	dateRangeString += " - " + months[endDate.getMonth()] + " " + endDate.getDate() + " " + endDate.getFullYear();

	console.log($eventProperties[eventID].dateRange);
	let accessibleDateRangeString = accessibleDate($eventProperties[eventID].dateRange[0], {
			    format: `M D Y to `,
			    language: `en`,
			    military: false
			});
	accessibleDateRangeString += " " + accessibleDate($eventProperties[eventID].dateRange[1], {
			    format: `M D Y`,
			    language: `en`,
			    military: false
			});
	console.log(accessibleDateRangeString);


	console.log("top of the interval")
	// property of sharing mechanism event concept: candidates for ultimate event time
	// related functions: topTimesToText, getTimes, postTimes, getAllUserTimes, getTopNIntervals
	let topIntervals = getTopNIntervals(getAllUserTimes(true), 5);
	// console.log(topIntervals);
	getTimes();

	// Concepts incorporated: Rendering Times
	let topTimesText = topTimesToText(topIntervals);
	function topTimesToText(topIntervalsPromise) {
		// console.log({topIntervalsPromise})
		let topIntervals = topIntervalsPromise;
		// console.log({topIntervals})
		let topTimesText = [];
		topIntervals.forEach((interval) => {
			let day = interval['start'][0];
			let startMin = interval['start'][2];
			let startMeridiem = 'am'
			if (interval['start'][1] > 12) {
				interval['start'][1] -= 12;
				startMeridiem = 'pm'
			}
			let startTime = interval['start'][1] + ':' + (startMin == 0 ? '00' : startMin.toString()) + startMeridiem;
			let endMin = interval['end'][2];
			let endMeridiem = 'am'
			if (interval['end'][1] > 12) {
				interval['end'][1] -= 12;
				endMeridiem = 'pm'
			}
			let endTime = interval['end'][1] + ':' + (endMin == 0 ? '00' : endMin.toString()) + endMeridiem;


			// Currently incorrect, but user does not see. The current day's month/day for setting up a datetime are eventually discarded in the display and only the hours/minutes are accurate
			let currentDate = new Date();

			// Also incorrect in that doesn't support timezones (beyond Boston/NY GMT-5)
			// subtract 5 because dateTime is in local time zone GMT-5 where i'm coding, but eventually toISOString changes it to UTC time zone
			let startDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), interval['start'][1] - 5, interval['start'][2]);
			let endDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), interval['end'][1] - 5, interval['end'][2]);

			startDateTime = startDateTime.toISOString();
			endDateTime = endDateTime.toISOString();
			let numUsers = interval['users'].size;
			let users = Array.from(interval['users']).join(', ');
			let accessibleStartDate = accessibleDate(startDateTime, {
			    format: `H MM m to `,
			    language: `en`,
			    military: false
			});
			let accessibleEndDate = accessibleDate(endDateTime, {
			    format: `H MM m`,
			    language: `en`,
			    military: false
			});
			let accessibleTime = dayArr[day] + " " + accessibleStartDate + " " + accessibleEndDate;
			topTimesText.push({day: day, startTime: startTime, endTime: endTime, numUsers: numUsers, users: users, accessibleTime: accessibleTime})
		});
		return topTimesText;
	};

	// Concepts incorporated: Time Text Description
	// function handleInput() {
	// 	availableTimes = processText(text);
	// };


	function getTimes(){
		currentEvent.set(location.href.split("/")[3]);
		console.log($currentEvent);
		let data;
		if ($currentEvent in $storedData) {
			data = $storedData[$currentEvent];
		} else {
			data = {};
			storedData.set(Object.assign({}, {[$currentEvent]: {}}, $storedData));
		}
		console.log("whatup");
		console.log($storedData);
		// const data = db.read()
		return data
	}

	function postTimes(username, userTimes){
		console.log('in post times')
		const strUserTimes = JSON.stringify(userTimes);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({name: username, times: strUserTimes})
		}
		const localData = {[username]: strUserTimes};
		const localDataWithEvent = {[$currentEvent]: Object.assign({}, $storedData[$currentEvent], localData)}
		console.log($currentEvent);
		console.log(localData);
		storedData.set(Object.assign({}, $storedData, localDataWithEvent));
		// db.write(localData)
		console.log(localDataWithEvent);
		console.log($storedData);
		return localData
	}
	
	async function submit() {
		if (name ===''){
			alert('please include name!')
		}
		else{
			// console.log('here in submit');
			// try {
			//     loading = true;

			//     console.log('here1 in submit');
			//     const requestOptions = {
			//       method: "POST",
			//       headers: { "Content-Type": "application/json" },
			//       body: JSON.stringify({ prompt }),
			//     };

			//     console.log('here2 in submit');

			//     const res = await fetch("http://localhost:5000/ask", requestOptions);

			//     console.log('here3 in submit');

			//     if (!res.ok) {
			//       throw new Error("Something went wrong");
			//     }

			//     const { message } = await res.json();
			//     console.log('message');
			//     console.log(message);
			//   } catch (err) {
			//     console.error(err, "err");
			//   } finally {
			//     loading = false;
			//   }

			availableTimes = processText(text);
			postTimes(name, availableTimes);
			let userTimes = getAllUserTimes(true);
			console.log("utimes");
			console.log(userTimes);
			topTimesText = topTimesToText(getTopNIntervals(userTimes, 5));
			console.log("topn");
			console.log(topTimesText);
			currentUser.set(name);
			name = '';
			text = '';
			document.getElementById("confirmation").value = '';
			document.getElementById("presub").value = "Submit";
			document.getElementById("confirmation").value = '';
			presubmitted = false;
			editedAfterPresubmit = false;
		}
		
	};

	// Concepts incorporated: User
	function getAllUserTimes(allInfo = false) {
		let userTimes = [];
		let payload = getTimes();
		console.log("payday");
		console.log({payload})
		for (let i = 0; i < Object.keys(payload).length; i++) {
			console.log(Object.keys(payload)[i]);
			if (allInfo){
				userTimes.push({name: Object.keys(payload)[i],
								times: payload[Object.keys(payload)[i]]
							   });
			}
			else{
				userTimes.push(payload[Object.keys(payload)[i]]);
			}
	      	
        };
		return userTimes
	};

	async function presubmit() {
		if (name ===''){
			alert('please include name!')
		}
		else{
			presubmitted = true;
			editedAfterPresubmit = false;
			document.getElementById("presub").value = "Re-Process Rext";
			availableTimes = processText(text);
			document.getElementById("confirmation").value = render(availableTimes);
			document.getElementById("confirmation").style.backgroundColor = "white";
			document.getElementById("edited").innerText = "";
		
		}
	}

	// [["2023-05-03T19:00:00.000Z","2023-05-04T04:00:00.000Z"]]
	function render(available) {
		console.log(available);
	    let a = "";
		for (let i = 0; i < Object.keys(available).length; i++) {
			let k = Object.keys(available)[i];
			let v = available[k];
			for (let j = 0; j < v.length; j++) {
				let start = String(v[j][0]);
				let end = String(v[j][1]);
				// remove timezone from confirmation text
				console.log(start);
				console.log(end);
				start = start.substring(0, start.indexOf(" GMT")).slice(0,-3);
				end = end.substring(0, end.indexOf(" GMT")).slice(0,-3);
				a += start + " to " + end + ",\n";
			}
		}
		return a;
	}

	function retro() {
		console.log("retro called");
		editedAfterPresubmit = true;
		if (presubmitted && editedAfterPresubmit) {
			console.log("retro really called");
			document.getElementById("confirmation").style.backgroundColor = "#D3D3D3";
			document.getElementById("edited").innerText = "Parse is no longer accurate because input has been edited since \"Process Text\" was last pressed. To regenerate parsed times, press \"Process Text\" again.";
			// document.getElementById("final-submit").addClass('disabled');
		}
	}
	// $: timeArr = text ? makeTimeArr(processText(text)) : Array(24).fill(0).map(() => Array(7).fill(0))
	// console.log($storedData);

</script>


<!-- TODO: create error message to render if user routes to event that doesn't exist -->
<main>
	<div class="cf">
		<button type="button" class="btn btn-primary btn-lg mb-3" on:click={() => location.href = "/"}>Back to Home Page</button>
		<div class="input-side" role="region">
			<h2 id="event-name">{$eventProperties[eventID].eventName}</h2>
			<p>Event Code: {eventID}</p>
			<p aria-label={accessibleDateRangeString}>{dateRangeString} </p>
			<h3>Share Your Availability</h3>
			<div class="name-wrapper">
				<label id="name-label" for="name"><h3>Name: </h3></label>
				<input id="name" bind:value={name}>
			</div>
			<TimeZoneSelect></TimeZoneSelect>
			<p class="instructions"><b>Voice Record</b> or <b>Type</b> your availability into the box below. Start with the <u>day of the week</u> followed by the <i>times</i>. For example, you can say, I'm free... "<u>Monday</u> <i>9am-10am</i> and <i>11am-12pm</i>, <u>Tuesday</u> <i>except 3-4pm</i>," and so on... Be sure to indicate AM or PM.</p>
			<VoiceRecognition bind:noteContent = {text}></VoiceRecognition>
			<textarea on:keyup={retro} aria-label="an input field for your availability" bind:value={text} placeholder=""></textarea>
			<br>
			<input id="presub" type="button" class="btn btn-primary btn-sm" value="Process Text" on:click={presubmit}>
			<br>
			<label for="confirmation"><p class="instructions"><b>Parsed Availability</b>. Here's what we got. Make any changes by editing the box above or re-recording and pressing "Submit" again.</p></label>
			<textarea style="background-color:white" readonly id = "confirmation" aria-label="an input field to confirm availability" placeholder=""></textarea>
			<br>
			<p id="edited"></p>
			<input type="button" id="final-submit" class="btn btn-primary btn-sm mb-2" value="Submit Final Response" on:click={submit}>
			<br>
			

			<!-- <Table timeArr = {makeTimeArr(processText(text))}></Table> -->
		</div>
		
		<div class="top-times-side" role="region">
			<h2>Top Times for Everyone</h2>
			{#await topTimesText}
				<p>Processing Times...</p>
			{:then topTimes}
			{#each topTimes as time}
				<div class = 'top-time'>
					<p><b><time datetime="" aria-label={time.accessibleTime}>{dayArr[time.day]} {time.startTime} - {time.endTime}</time></b>
					<br>
					<u>{time.numUsers} people</u><br></p>
					({time.users})
				</div>
				<br>
			{/each}
			{/await}
	</div>
	</div>
	</main>

<style>
	
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		font-size: 2em;
		font-weight: 100;
	}

	p {
		margin-bottom: 4px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	textarea {
		height: 150px;
		width: 80%;
	    max-width: 350px;
	    min-width: 200px;
		padding-bottom: 150px;
	}

	h2 {
		margin-top: 5px;
	}

	.name-wrapper {
		display: flex;
		justify-content: center;

	}

	.name-wrapper h3 {
		margin-top: 5px;
	}

	#name {
		height: 35px;
	}

	#name-label {
		padding-right: 15px;
	}

	.instructions {
		max-width: 85%;
		margin: 10px auto;
	}

	.input-side {
		float: left;
    	_display: inline;
    	width: 100%;
    	background-color: #eee;
	}

	.top-times-side {
		float: left;
		_display: inline;
		width: 100%;
		background-color: #f4f4f4;
	}

	.top-time {
		margin: 0% 10%;
	}

	@media screen and (min-width: 30em) {
    .input-side {
	        width: 70%;
	    }
	.top-times-side {
			width: 30%;
		}
	}

	.cf:before, .cf:after {
    content: " ";
    display: table;
	}

	.cf:after {
	    clear: both;
	}

	.cf {
	    *zoom: 1;
	}

	.disabled{
	  pointer-events: none;
	}

</style>