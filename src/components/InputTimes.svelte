<script>
	import VoiceRecognition from './VoiceRecognition.svelte'
	import {processText, makeTimeArr, getTopNIntervals} from '../helpers.js';
	import Table from './Table.svelte';
	import { storedData, currentUser } from '../stores.js';

	const dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	export let eventID;
	let name = '';
	let text = '';
	let availableTimes = null;
	let API_BASE = 'http://localhost:3001';
	import accessibleDate from 'accessible-date';

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
		const data = $storedData;
		console.log('in get times. data:');
		console.log(data);
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
		const localData = {[username]: strUserTimes}
		console.log(localData);
		storedData.set(Object.assign({}, localData, $storedData));
		return localData
	}
	
	async function submit() {
		if (name ===''){
			alert('please include name!')
		}
		else{
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
		}
		
	};

	// Concepts incorporated: User
	function getAllUserTimes(allInfo = false) {
		let userTimes = [];
		let payload = getTimes();
		console.log("payday");
		console.log({payload})
		for (let i = 0; i < Object.keys(payload).length; i++) {
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
			availableTimes = processText(text);
			document.getElementById("confirmation").value = render(availableTimes);
		
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
				start = start.substring(0, start.indexOf(" ("));
				end = end.substring(0, end.indexOf(" ("));
				a += start + " to " + end + ",\n";
			}
		}
		return a;
	}

	// $: timeArr = text ? makeTimeArr(processText(text)) : Array(24).fill(0).map(() => Array(7).fill(0))
	// console.log($storedData);

</script>

<main>
	<h1>When2Speech</h1>
	<h3>A speech and text based way to find times to meet with others.</h3>
	<div class="cf">
		<div class="input-side" role="region">
			<h2>Event {eventID}</h2>
			<h2>Share Your Availability</h2>
			<label for="name"><h3>Name?</h3></label>
			<input id="name" bind:value={name}>
			<h3>When are you available to meet?</h3>
			<p><b>Voice Record</b> or <b>Type</b> your availability into the box below. Start with the <u>day of the week</u> followed by the <i>times</i>. For example, you can say, I'm free... "<u>Monday</u> <i>9am-10am</i> and <i>11am-12pm</i>, <u>Tuesday</u> <i>except 3-4pm</i>, Wednesday after 3pm" and so on... Be sure to indicate AM or PM.</p>
			<VoiceRecognition bind:noteContent = {text}></VoiceRecognition>
			<textarea aria-label="an input field for your availability" bind:value={text} placeholder=""></textarea>
			<br>
			<input class="submit" type="button" value="Submit" on:click={presubmit}>
			<br>
			<label for="confirmation"><h3>Parsed Availability</h3></label>
			<p>Here's what we got. Make any changes by editing the box above and pressing "Submit" again.</p>
			<textarea readonly id = "confirmation" aria-label="an input field to confirm availability" placeholder=""></textarea>
			<br>
			<input class="submit" type="button" value="Submit Final Response" on:click={submit}>
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

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	textarea {
		height: 150px;
		max-width: 350px;
		padding-bottom: 150px;
	}

	.submit {
		font-size: 1.7em;
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
</style>