class Subs {
	constructor() {
		if (!window.sessionStorage.getItem("subscribers")) {
			window.sessionStorage.setItem("subscribers", JSON.stringify({}))
		}
		this.subscribers = JSON.parse(window.sessionStorage.getItem("subscribers"));
	}


	add(context) {
		this.subscribers[context.username] = context;
		window.sessionStorage.setItem("subscribers", JSON.stringify(this.subscribers));
	}

	has(name) {
		return Object.keys(this.subscribers).includes(name);
	}

	reset() {
		this.subscribers = {};
		window.sessionStorage.setItem("subscribers", JSON.stringify(this.subscribers));
	}
}
