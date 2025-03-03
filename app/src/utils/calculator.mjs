const OPERATOR_PRESCEDENCE = {
  '+': 1,
  '-': 1,
  '*': 2,
};

export function calculate(equation) {
  const tokens = [];
  while(equation.length) {
    let token = getNextToken(equation);
    
    if (!token) {
      throw new CalculateError('Failed to parse next token', {expression: equation});
    }
    
    equation = equation.slice(token.value.length);
    
    if (token instanceof Operand) {
      // Combine decimals with the previous operand token
      if (token.value.includes('.')) {
        if (!tokens.length) {
          tokens.push(new Operand('0'));
        }
        
        tokens[tokens.length - 1].value += token.value;
        continue;
      } else {
        // Did we end up with back to back operands?
        if (tokens.length && tokens[tokens.length - 1] instanceof Operand) {
          throw new CalculateError('Illegal back to back operands', {current: token.value, previous: tokens[tokens.length - 1].value});
        }
      }
    } else if (token instanceof Operator) {
      // No starting operators or back to back operators allowed
      if (!tokens.length) {
        throw new CalculateError('Illegal starting operator', {current: token.value});
      } else if (tokens[tokens.length - 1] instanceof Operator) {
        throw new CalculateError('Illegal back to back operators', {current: token.value, previous: tokens[tokens.length - 1].value});
      }
    }
    
    tokens.push(token);
  }
  
  const main_stack = [];
  const operator_stack = [];
  
  for (const token of tokens) {
    if (token instanceof Operand) {
      main_stack.push(token);
    } else if (token instanceof Operator) {
      const prescedence = OPERATOR_PRESCEDENCE[token.value];
      let stack_prescedence = OPERATOR_PRESCEDENCE[operator_stack[operator_stack.length - 1]?.value] ?? 0;
      if (prescedence <= stack_prescedence) {
        flushOperatorStack(main_stack, operator_stack, token);
        operator_stack.push(token);
      } else {
        operator_stack.push(token);
      }
    }
  }
  
  if (operator_stack.length) {
    flushOperatorStack(main_stack, operator_stack);
  }
  
  for (let i = 0; i < main_stack.length; i++) {
    const token = main_stack[i];
    
    if (token instanceof Operator) {
      let value;
      const o1 = Number(main_stack[i - 2].value);
      const o2 = Number(main_stack[i - 1].value);
      
      switch (token.value) {
        case '+':
          value = o1 + o2;
          break;
        case '-':
          value = o1 - o2;
          break;
        case '*':
          value = o1 * o2;
          break;
        default:
          throw new CalculateError('Unknown operator', {operator: token.value});
      }
      
      main_stack[i - 2].value = String(value);
      main_stack.splice(i - 1, 2);
      i -= 2;
    }
  }
  
  if (main_stack.length !== 1) {
    throw new CalculateError('Illegal final calculated state', {stack: main_stack});
  }
  
  return Number(main_stack[0].value);
}

function flushOperatorStack(main_stack, operator_stack, current_operator = null) {
  const prescedence = OPERATOR_PRESCEDENCE[current_operator?.value] ?? 0;
  
  while(operator_stack.length) {
    const stack_prescedence = OPERATOR_PRESCEDENCE[operator_stack[operator_stack.length - 1]?.value] ?? 0;
    if (prescedence <= stack_prescedence) {
      main_stack.push(operator_stack.pop());
    }
  }
}

function getNextToken(equation) {
  let match = equation.match(/^\d+/);
  if (match) {
    return new Operand(match[0]);
  }
  match = equation.match(/^\.\d+/);
  if (match) {
    return new Operand(match[0]);
  }
  match = equation.match(/[+\-*]/);
  if (match) {
    return new Operator(match[0]);
  }
  return null;
}

class Operand {
  constructor(value) {
    this.value = value;
  }
}

class Operator {
  constructor(value) {
    this.value = value;
  }
}

class CalculateError extends Error {
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}