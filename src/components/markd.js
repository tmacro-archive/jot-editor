var Remarkable = require('remarkable');

var md = new Remarkable();

const expr = {
	task: /^\s*\[([xX\s])?\]\s?(.+)/
}

var parseTask = function (state, check) {
	var match = expr.task.exec(state.src.slice(state.pos))
	if (!match) return false
	console.log(match)
	if (!check) {
		state.push({
			type: 'task',
			title: match[2],
			complete: match[1] == 'x' || match[1] == 'X'
		})
	}
	state.pos += match[0].length
}

var renderTask = function (tokens, id, options, env) {
	if (tokens[id] == 'task') {
		console.log('rendering task')
		console.log(env)
		return '<input type="checkbox" value="true"></input>'
	}
}

var jotPlugin = function (md, options) {
	md.inline.ruler.push('jotTask', parseTask)
	md.renderer.rules.parsTask = renderTask
	// md.renderer.rules.push('task', renderTask, {})
}

md.use(jotPlugin)

export default md
