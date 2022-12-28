class Subs {
	constructor() {
		this.subscribers = {}
	}

	add(context) {
		this.subscribers[context.username] = context;
	}

	has(name) {
		return Object.keys(this.subscribers).includes(name);
	}
}
