import React from 'react';
import Definition from './langdef';
import * as jsleri from 'jsleri';


function walkTree (tree, nodes) {
    if (tree.element instanceof jsleri.Keyword ||
        tree.element instanceof jsleri.Regex ||
        tree.element instanceof jsleri.Token ||
        tree.element instanceof jsleri.Tokens) {
        nodes.push(tree);
    }
    for (var i = 0, l = tree.children.length; i < l; i ++) {
        walkTree(tree.children[i], nodes);
    }
}

function spliceSlice(str, start, end, add) {
    return str.slice(0, start) + (add || '') + str.slice(end);
}


class Query extends React.Component {
    constructor(props) {
        super(props);

        this.grammar = new Definition();

        this.state = {
            line: [
                'a = 0;',
                'b = {',
                '    a: 0,',
                '};'
            ].join('\n'),
            isValid: false,
        };
    }

    onKeyDown = (e) => {
        const {line} = this.state;
        if (e.key === 'Tab') {
            e.preventDefault(); // TODOK
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            // const line = e.target.value;
            const selection = line.slice(start, end);
            if (selection && selection.includes('\n')) {
                if (e.shiftKey) {
                    const lines = line.slice(0, end).split('\n');
                    let ii = 0;

                    for (let i=0; i<lines.length; i++) {
                        const ll = lines[i].length;
                        if (ii + ll > start) {
                            let j;
                            for (j=0; j<4; j++) {
                                if (lines[i][j] !== ' ') {
                                    break;
                                }
                            }
                            lines[i] = lines[i].slice(j);
                        }
                        ii += ll+1;
                    }
                    const line_ = lines.join('\n')+line.slice(end);
                    const line0 = line.slice(start);
                    let j;
                    for (j=0; j<4; j++) {
                        if (line0[j] !== ' ') {
                            break;
                        }
                    }

                    this.setState({line: line_}, () => {
                        console.log('tab setstate cb multiline inv', j)
                        this.ta.selectionStart = Math.max(0, start-4+j);
                        this.ta.selectionEnd = end-selection.split('\n').length*4+4;
                    });
                } else {
                    const line_ = line.slice(0, start) + '    ' + selection.replace(/\n/g, '\n    ') + line.slice(end);
                    this.setState({line: line_}, () => {
                        console.log('tab setstate cb multiline', start, end)
                        this.ta.selectionStart = start;
                        this.ta.selectionEnd = end+selection.split('\n').length*4-4;
                    });
                }

            } else {
                if (e.shiftKey) {
                    // TODOK
                } else {
                    const line_ = line.slice(0, start) + '    '.slice(end%4) + line.slice(start);
                    this.setState({line: line_}, () => {
                        console.log('tab setstate cb', start, end)
                        this.ta.selectionStart = this.ta.selectionEnd = start+4-end%4;
                    });
                }

            }
        } else if (e.key === '{') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const line_ = line.slice(0, start) + '{}' + line.slice(start);
            this.setState({line: line_}, () => {
                this.ta.selectionStart = this.ta.selectionEnd = start+1;
            });
        }
    }

    onChange = (e) => {
        this.onChangeLine(e.target.value);
        // console.log('onchange')
    }

    onChangeLine = (line) => {
        const res = this.grammar.parse(line);
        const isValid = res.isValid;
        // const eles = res.isValid
        this.setState({line, isValid});
    }

    colorLine = (line) => {
        const res = this.grammar.parse(line);
        let linenew = [];
        const nodes = [];
        walkTree(res.tree, nodes);
        nodes.reverse();
        for (let nn = 0, ll = nodes.length; nn < ll; nn++) {
            let elmt;
            const node = nodes[nn];
            if (node.element instanceof jsleri.Keyword)
                // elmt = '<span class="siri-keyword">' + node.str + '</span>';
                linenew.push(<span>{node.str}</span>)
            else if (node.element instanceof jsleri.Regex) {
                if (node.str[0] == '#')
                    // elmt = '<span class="siri-comment">' + node.str + '</span>';
                    linenew.push(<span>{node.str}</span>)
                else if (node.str[0] == '\'' || node.str[0] == '"')
                    elmt = '<span class="siri-string">' + node.str + '</span>';
                else
                    elmt = '<span class="siri-regex">' + node.str + '</span>';
            } else if (node.element instanceof jsleri.Token || node.element instanceof jsleri.Tokens) {
                elmt = '<span class="siri-token">' + node.str + '</span>';
            }
            // linenew = spliceSlice(linenew, node.start, node.end, elmt);
        }
        return linenew;
    }

    render() {
        const {line, isValid} = this.state;

        return (
            <div style={{fontFamily: 'monospace', position: 'relative', cursor: 'text'}}>
                {line.split('\n').map((line, i) => (
                    <div key={i} style={{height: '1rem', background: '#eee', zIndex: 1}}>
                        <pre style={{margin: '0 2px', fontFamily: 'inherit'}}>
                            {this.colorLine(line)}
                        </pre>
                    </div>
                ))}
                <textarea
                    style={{position: 'absolute', top: 0, fontFamily: 'inherit', fontSize: 'inherit', outline: 'none', border: 'none', color: 'transparent', caretColor: 'green', opacity: .5, lineHeight: '1rem'}}
                    rows={5}
                    cols={80}
                    ref={(node) => this.ta = node || this.ta}
                    autoFocus
                    spellCheck={false}
                    value={line}
                    onSelect={this.onSelection}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                />
            </div>
        );

    }

};
export default Query;