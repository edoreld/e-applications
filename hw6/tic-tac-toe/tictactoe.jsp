<!DOCTYPE html>
<html>
<head>
	<title>Tic-Tac-Toe</title>
	<meta charset="UTF-8">
	<style>

	body {
		max-width: 480px;
		margin: 0 auto
	}
	table {
		border: 2px solid #36006f
	}
	td {
		width: 10px;
		height: 10px;
		background-color: white;
	}

	td:hover {
		background-color: #80d8df
	}

</style>
</head>
<body>

	<%@ page import="java.util.*" %>

	<%!
	boolean xTaken = false;
	boolean oTaken = false;
	int turnFlag = 1;

	boolean gameInProgress = false;
	Board board = new Board();
	boolean victory = false;

	public class Board {


		String[][] board = new String[][] {
			{"", "", ""},
			{"", "", ""},
			{"", "", ""}
		};

		public boolean setValue(String sign,int row, int col) {
			// if (gameFinished == 1) {
			// 	return;
			// }
			board[row][col] = sign;
			int boardSize = 3;

				// check the row where a piece has been changed
			for (int i = 0; i < boardSize; i++) {
				if (!board[row][i].equals(sign)) {
					break;
				}
				if (i == boardSize - 1) {
					return true;
				}
			}

				// check the column where a sign has been changed
			for (int i = 0; i < boardSize; i++) {
				if (!board[i][col].equals(sign)) {
					break;
				}
				if (i == boardSize - 1) {
					return true;
				}
			}

				// check the diagonal
			if (row == col) {
				for (int i = 0 ; i < boardSize; i++) {
					if (board[i][i] != sign ) {
						break;
					}
					if (i == boardSize - 1) {
						return true;
					}
				}
			}

				// check the backward diagonal
			if (row + col == boardSize - 1) {
				for (int i = 0 ; i < boardSize; i++) {
					if (!board[i][(boardSize -1) - i].equals(sign)) {
						break;
					}
					if (i == boardSize - 1) {
						return true;
					}
				}
			}
			return false;
		}

	}
	%>

	<%
		if (request.getParameter("restart") != null) {
			board = new Board();
			victory = false;
		}

	%>
	<%
		if (request.getParameter("username") != null) {
			session.setAttribute("username", request.getParameter("username"));
			session.setAttribute("sign", request.getParameter("sign"));
			if (request.getParameter("sign").equals("X")) {
				xTaken = true;
			} else {
				oTaken = true;
			}
		}
	%>

	<%
		if (session.getAttribute("username") != null) {
			out.println("You are playing as " + session.getAttribute("sign"));
		}
	%>

	<%
		if (session.getAttribute("username") == null && xTaken == false) { %>
			<p>Play as player X!</p>
			<form method="get">
				Username <input type="text" name="username" autofocus />
				<input type="hidden" name="sign" value="X">
				<input type="submit" value="Play!" tabindex="-1" />
			</form>
		<% } %>

	<%
if (session.getAttribute("username") == null && oTaken == false) { %>
<p>Play as player O!</p>
<form method="get">
	Username <input type="text" name="username" autofocus />
	<input type="hidden" name="sign" value="O">
	<input type="submit" value="Play!" tabindex="-1" />
</form>
<% } %>

<% if (session.getAttribute("username") != null) { %>
<table>
	<tbody>
		<% for (int i = 0 ; i < board.board.length ; i++) {
		out.print("<tr>");
			for (int j = 0 ; j < board.board.length ; j++) {
			out.print("<td>" + board.board[j][i]);
			}
		out.println("</tr>");
	}
	%>


</tbody>
</table>

<form>
	<input type="submit" value="Refresh" />
</form>

	<form method="get">
		<input type="submit" value="Restart" />
		<input type="hidden" name="restart" value="1" />
	</form>

<% } %>

<%

		// Game running
if (xTaken && oTaken) {

	if (!victory) {
		out.println("Current status, player " + (turnFlag == 1 ? "X" : "O") + " to play");
	} else {
		out.println("Victory has been achieved");
	}

if (request.getParameter("column") != null && request.getParameter("row") != null) {
	if (board.board[Integer.parseInt(request.getParameter("row"))][Integer.parseInt(request.getParameter("column"))].equals("")) {
			if (board.setValue((turnFlag == 1 ? "X" : "O"), Integer.parseInt(request.getParameter("row")), Integer.	parseInt(request.getParameter("column")))) {
				out.println("Victory has been achieved");
				victory = true;

	}
	turnFlag = (turnFlag == 1 ? 0 : 1);
}


}
%>

<%
if (session.getAttribute("sign")!= null && session.getAttribute("sign").equals((turnFlag == 1 ? "X" : "O")) && !victory) { %>
<form method="post">
	Row <input type="text" name="column" />
	Column <input type="text" name="row" />
	<input type="submit" value="Submit" />
</form>

<% }
}
%>
</body>
</html>