/*
 * This grammar is generated using the Grammar.export_js() method and
 * should be used with the `jsleri` JavaScript module.
 *
 * Source class: Definition
 * Created at: 2019-07-22 10:57:10
 */

import { Tokens, Choice, Grammar, List, Optional, Sequence, Regex, Ref, THIS, Repeat, Token, Keyword, Prio } from 'jsleri';

const buildinFunctions = Choice(
    Keyword('startswith'),
    Keyword('endswith'),
    Keyword('id'),
);

const nodeScope = [
    'counters',
    'node_info',
    'nodes_info',
    'reset_counters',
    'set_log_level',
    'shutdown',
];

const thingsScope = [
    'collection_info',
    'collections_info',
    'del_collection',
    'del_expired',
    'del_token',
    'del_user',
    'grant',
    'new_collection',
    'new_node',
    'new_token',
    'new_user',
    'pop_node',
    'rename_collection',
    'rename_user',
    'replace_node',
    'revoke',
    'set_password',
    'set_quota',
    'user_info',
    'users_info',
];

const nodeFunctions = Choice(...nodeScope.map((d) => Keyword(d)));
const thingsFunctions = Choice(...thingsScope.map((d) => Keyword(d)));

class Definition extends Grammar {
    static r_single_quote = Regex('^(?:\'(?:[^\']*)\')+');
    static r_double_quote = Regex('^(?:"(?:[^"]*)")+');
    static t_false = Keyword('false');
    static t_float = Regex('^[-+]?((inf|nan)([^0-9A-Za-z_]|$)|[0-9]*\\.[0-9]+(e[+-][0-9]+)?)');
    static t_int = Regex('^[-+]?((0b[01]+)|(0o[0-8]+)|(0x[0-9a-fA-F]+)|([0-9]+))', {color: 'green'});
    static t_nil = Keyword('nil');
    static t_regex = Regex('^(/[^/\\\\]*(?:\\\\.[^/\\\\]*)*/i?)');
    static t_string = Choice(
        Definition.r_single_quote,
        Definition.r_double_quote
    );
    static t_true = Keyword('true');
    static o_not = Repeat(Token('!'), 0, undefined);
    static comment = Repeat(Regex('COMMENT'), 0, undefined); //Repeat(Regex('^(?s)/\\\\*.*?\\\\*/'), 0, undefined);
    static name = Regex('^[A-Za-z_][0-9A-Za-z_]*', {color: 'blue'});
    static tmp = Regex('^\\$[A-Za-z_][0-9A-Za-z_]*');
    static primitives = Choice(
        Definition.t_false,
        Definition.t_nil,
        Definition.t_true,
        Definition.t_float,
        Definition.t_int,
        Definition.t_string,
        Definition.t_regex
    );
    static scope = Ref(Sequence);
    static chain = Ref(Sequence);
    static thing = Sequence(
        Token('{'),
        List(Sequence(
            Definition.name,
            Token(':'),
            Definition.scope
        ), Token(','), 0, undefined, true),
        Token('}')
    );
    static array = Sequence(
        Token('['),
        List(Definition.scope, Token(','), 0, undefined, true),
        Token(']')
    );
    static closure = Sequence(
        Token('|'),
        List(Definition.name, Token(','), 0, undefined, true),
        Token('|'),
        Definition.scope
    );
    static function = Sequence(
        Choice(
            buildinFunctions,
            // thingsFunctions,
            // nodeFunctions,
            Definition.name,
        ),
        Token('('),
        List(Definition.scope, Token(','), 0, undefined, true),
        Token(')')
    );
    static opr0_mul_div_mod = Tokens('// * / %');
    static opr1_add_sub = Tokens('+ -');
    static opr2_bitwise_and = Tokens('&');
    static opr3_bitwise_xor = Tokens('^');
    static opr4_bitwise_or = Tokens('|');
    static opr5_compare = Tokens('== != <= >= < >');
    static opr6_cmp_and = Token('&&');
    static opr7_cmp_or = Token('||');
    static operations = Sequence(
        Token('('),
        Prio(
            Definition.scope,
            Sequence(
                THIS,
                Choice(
                    Definition.opr0_mul_div_mod,
                    Definition.opr1_add_sub,
                    Definition.opr2_bitwise_and,
                    Definition.opr3_bitwise_xor,
                    Definition.opr4_bitwise_or,
                    Definition.opr5_compare,
                    Definition.opr6_cmp_and,
                    Definition.opr7_cmp_or
                ),
                THIS
            )
        ),
        Token(')'),
        Optional(Sequence(
            Token('?'),
            Definition.scope,
            Optional(Sequence(
                Token(':'),
                Definition.scope
            ))
        ))
    );
    static assignment = Sequence(
        Definition.name,
        Tokens('+= -= *= /= %= &= ^= |= ='),
        Definition.scope
    );
    static tmp_assign = Sequence(
        Definition.tmp,
        Tokens('+= -= *= /= %= &= ^= |= ='),
        Definition.scope
    );
    static index = Repeat(Sequence(
        Token('['),
        Definition.scope,
        Token(']')
    ), 0, undefined);
    static deephint = Sequence(
        Token('=>'),
        Definition.t_int
    );
    static block = Sequence(
        Token('{'),
        Definition.comment,
        List(Definition.scope, Sequence(
            Token(';'),
            Definition.comment
        ), 1, undefined, true),
        Optional(Definition.deephint),
        Token('}')
    );
    static statements = List(Definition.scope, Sequence(
        Token(';'),
        Definition.comment
    ), 0, undefined, true);
    static START = Sequence(
        Definition.comment,
        Definition.statements,
        Optional(Definition.deephint)
    );

    constructor() {
        super(Definition.START, '^[A-Za-z_][0-9A-Za-z_]*');
    }
}

Definition.scope.set(Sequence(
    Definition.o_not,
    Choice(
        Definition.primitives,
        Definition.function,
        Definition.assignment,
        Definition.tmp_assign,
        Definition.name,
        Definition.closure,
        Definition.tmp,
        Definition.thing,
        Definition.array,
        Definition.operations,
        Definition.block
    ),
    Definition.index,
    Optional(Definition.chain)
));
Definition.chain.set(Sequence(
    Token('.'),
    Choice(
        Definition.function,
        Definition.assignment,
        Definition.name
    ),
    Definition.index,
    Optional(Definition.chain)
));

export default Definition;
