using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace CodeTown.Cli;

public static class ComplexityAnalyzer
{
    public static int Calculate(MethodDeclarationSyntax method)
    {
        if (method.Body is null && method.ExpressionBody is null)
        {
            return 0;
        }

        var nodes = method.DescendantNodes(node => node is not (AnonymousFunctionExpressionSyntax or LocalFunctionStatementSyntax));

        int decisionCount = nodes.Count(node => node switch
        {
            IfStatementSyntax or ForStatementSyntax or ForEachStatementSyntax or ForEachVariableStatementSyntax or WhileStatementSyntax or DoStatementSyntax or CatchClauseSyntax or ConditionalExpressionSyntax or CaseSwitchLabelSyntax or CasePatternSwitchLabelSyntax or WhenClauseSyntax => true,

            BinaryExpressionSyntax expression => expression.IsKind(SyntaxKind.LogicalAndExpression) || expression.IsKind(SyntaxKind.LogicalOrExpression) || expression.IsKind(SyntaxKind.CoalesceExpression),

            SwitchExpressionArmSyntax arm => arm.Pattern is not (DiscardPatternSyntax or VarPatternSyntax),

            _ => false
        });

        return 1 + decisionCount;
    }
}