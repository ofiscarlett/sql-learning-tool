const { parse } = require('pgsql-ast-parser');

function safeParse(sql) {
    try {
        return parse(sql)[0];
    } catch (e) {
        console.error('AST parse error:', e.message);
        return null;
    }
}

function calculatePartialScore(studentAns, correctAns) {
    const studentAst = safeParse(studentAns);
    const correctAst = safeParse(correctAns);
    if (!studentAst || !correctAst) {
        return 0;
    }
    
    let score = 0;
    let totalScore = 0; // Total score for the question
    //check if select statement is correct and at right place
    const sCols = (studentAst.columns || []).map(c => c.expr.name?.name || '').sort();
    const cCols = (correctAst.columns || []).map(c => c.expr.name?.name || '').sort();
    total += 1;
    if (JSON.stringify(sCols) === JSON.stringify(cCols)) {
        score += 1;
    } else if (sCols.some(col => cCols.includes(col))) {
        score += 0.5; // Partial credit for some correct columns
    }
    //compare the FROM clause
    const sFrom = (studentAst.from || []).map(f => f.name?.name || '').sort();
    const cFrom = (correctAst.from || []).map(f => f.name?.name || '').sort();
    totalScore += 1;
 if (JSON.stringify(sFrom) === JSON.stringify(cFrom)) {
  score += 1;
} else if (sFrom.some(t => cFrom.includes(t))) {
  score += 0.5; // 至少有命中一個表
}
  totalScore += 1;
  if (studentAst.orderBy && correctAst.orderBy) score += 1;

  //  GROUP BY
  totalScore += 1;
  if (studentAst.groupBy && correctAst.groupBy) score += 1;

  const finalScore = score / totalScore;
  return Math.round(finalScore * 100); // return  0–100 
}
module.exports = { calculatePartialScore };
