/*
 * Classic example grammar, which recognizes simple arithmetic expressions like
 * "2*(3+4)". The parser generated from this grammar then computes their value.
 */

start
    = expression

expression
    = additive:additive { return additive; }

/** å·¦çµåˆ **/
AdditiveOperator
    = operator:("+" / "-") { return operator; }

additive
    = head:multiplicative tail:( AdditiveOperator multiplicative ) * {
    var result = head;
    var len = tail.length;
    for (var i = 0; i < len; i++) {
        var op = tail[i][0];
        var val = tail[i][1];
        if (op == "+") {
            result = result + val;
        } else if (op == "-") {
            result = result - val;
        }
    }
    return result;
}

/** å·¦çµåˆ **/
MultiplicativeOperator
    = operator:("*" / "/") { return operator; }

multiplicative
    = head:powerTerm tail:(MultiplicativeOperator powerTerm) * {
    var result = head;
    var len = tail.length;
    for (var i = 0; i < len; i++) {
        var op = tail[i][0];
        if ("*" === op) {
            result = result * tail[i][1];
        } else if ("/" === op) {
            result = result / tail[i][1];
        } else if ("%" === op) {
            result = result % tail[i][1];
        }
    }
    return result;
}

/** å³çµåˆ **/
PowerOperator
    = operator:("^") { return operator; }

powerTerm
    = head:primary tail:(PowerOperator primary) * {
    var ans;
    var len = tail.length;
    if (len == 0) {
        ans = head;
    } else if (len == 1) {
        ans = Math.pow(head, tail[0][1]);
    } else {
        var power = tail[len - 1][1];
        for (var i = len - 2; i >= 0; i--) {
            power = Math.pow(tail[i][1], power);
        }
        ans = Math.pow(head, power);
    }
    return ans;
}

sign
    = _ "-" _ { return -1; }
/ _ "+"? _ { return 1; }

primary
    = float
/ integer
/ sign:sign "(" additive:additive ")" _ { return sign * additive; }

integer "integer"
    = sign:sign digits:[0-9]+ _ { return sign * parseInt(digits.join(""), 10); }

float "float"
    = sign:sign parts:([0-9]* "." [0-9]+) _ { return sign * parseFloat(parts[0].join("") + "." + parts[2].join("")); }

/* ===== Whitespace ===== */
_ "whitespace"
    = whitespace*

whitespace
    = [ \t\n\r]
