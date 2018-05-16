<html>
<head> <title> User Control Panel </title> </head>
<body>

	<%@ page import="java.util.*" %>

	<%!
	List<User> users = new ArrayList<>();
	User currentUser;
	List<_Message> msgs = new ArrayList<>();

	class _Message {
		String date;
		String sender;
		String recipient;
		String message;

		public _Message(String d, String s, String r, String m) { date = d; sender = s; recipient = r; message = m; };
		public String getSender() { return sender; };
		public String getRecipient() { return recipient; };
		public String getDate() { return date; };
		public String getMessage() { return message; };
		public void setSender(String s) { sender = s; };
		public void setRecipient(String r) { recipient = r; };
		public void setDate(String d) { date = d; };
		public void setMessage(String m) { message = m; };
	};

	class User {
		String name;
		String username;
		String password;
		public User(String u, String p, String n){ username = u; password = p; name = n; };
		public String getname() { return name; };
		public String getUsername() { return username; };
		public String getPassword() { return password; };
		public void setname(String n) { name = n; };
		public void setUsername(String u) { username = u; };
		public void setPassword(String p) { password = p; };
	};
	%>

	<% if (users.isEmpty()) {
		session.setAttribute("username", null);
	} %>


	<%
	if (request.getParameter("reg_username")!=null && request.getParameter("reg_username") != "" && request.getParameter("reg_name") != null && request.getParameter("reg_name") != "")	 {
		boolean userExists = false;
		for (int i = 0 ; i < users.size(); i++)
		{
			if (users.get(i).getUsername().equals(request.getParameter("reg_username")))
			{
				userExists = true;
				break;
			}
		}

		if (!userExists) {
			users.add(new User(request.getParameter("reg_username"), request.getParameter("reg_password"), request.getParameter("name")));
		} else {
			%> <p> User already exists </p> <%
		}
	}
%>

<%
if (request.getParameter("log_username")!=null && !request.getParameter("log_username").equals("") && request.getParameter("log_password") != null && !request.getParameter("log_password").equals("") && !users.isEmpty()) {

 	for (int i = 0 ; i < users.size(); i++) {
		String passedUser = request.getParameter("log_username");
		String passedPassword = request.getParameter("log_password");

		if (passedUser.equals(users.get(i).getUsername()) && passedPassword.equals(users.get(i).getPassword())) {
			session.removeAttribute("username");
			session.setAttribute("username", request.getParameter("log_username"));
			break;
		}
	}
}
%>

	<% if (session.getAttribute("username") != null && session.getAttribute("username") != "") { %>
		You are logged in as <%= session.getAttribute("username") %> <br />
		<% } %>

	<%	if (request.getParameter("submit") != null) {
		session.setAttribute("username", null);
	} %>

	<% if (session.getAttribute("username") == null) { %>
	<strong>Register</strong>
	<form method="post">
		Name: <input type="text" name="reg_name" autofocus /> <br />
		Username <input type="text" name="reg_username" /> <br />
		Password: <input type="password" name="reg_password" /> <br />
		<input type="submit" value="Go" tabindex="-1" />
	</form>
	<% } %>

	<% if (session.getAttribute("username") == null) { %>
	<strong>Log In</strong>
	<form method="post">
 		Username: <input type="text" name="log_username" /> <br />
		Password: <input type="password" name="log_password" /> <br />
		<input type="submit" value="Go" tabindex="-1" />
	</form>
	<% } %>

	<% if (session.getAttribute("username") != null) { %>
	<form method="post">
		<input type="submit" value="Log out" name="submit">
	</form>
	<hr />
	<% } %>




	<% if (session.getAttribute("username") != null) { %>
	<strong>User List:</strong>
	<ul>
		<% for(int j = 0; j < users.size(); j++) { %>
		<li> <%= users.get(j).getUsername() %> </li>
		<% } %>
	</ul>
	<hr />
	<% } %>

	<% if (request.getParameter("msg_to") != null && request.getParameter("msg_msg") != null) {
		String date = new Date().toString();
		String sender = session.getAttribute("username").toString();
		String recipient = request.getParameter("msg_to").toString();
		String msg = request.getParameter("msg_msg").toString();

		msgs.add(new _Message(date, sender, recipient, msg));
	} 	%>

	<% if (session.getAttribute("username") != null) { %>
		<table>
			<tbody>
				<tr>
					<td><strong> Date</strong></td>
					<td><strong> Sender</strong></td>
					<td><strong> Recipient</strong></td>
					<td><strong> Message</strong></td>
				</tr>

				<% for (int i = 0 ; i < users.size(); i++) {
					if (session.getAttribute("username").equals(users.get(i).getUsername())) {
						currentUser = users.get(i);
						break;
					}
				} %>

				<% for (int i = 0 ; i < msgs.size(); i++) { %>
					<% if (msgs.get(i).getSender().equals(session.getAttribute("username")) || msgs.get(i).getRecipient().equals(session.getAttribute("username"))) { %>
					<tr>
					<td> <%= msgs.get(i).getDate() %> </td>
					<td> <%= msgs.get(i).getSender() %> </td>
					<td> <%= msgs.get(i).getRecipient() %> </td>
					<td> <%= msgs.get(i).getMessage() %> </td>
					</tr>
				<% }
				} %>
			</tbody>
		</table>
	<hr />
	<% } %>


	<% if (session.getAttribute("username") != null) { %>
	<Strong>Send a message to another user</Strong>
	<form method="post">
	To <input type="text" name="msg_to" /> <br />
	Message <input type="text" name="msg_msg" /> <br />
	<input type="submit" value="send" name="send">
	</form>
	<% } %>

	<strong>Session Variables</strong> <br />
	<%
	Enumeration keys = session.getAttributeNames();
	while (keys.hasMoreElements())
	{
  		String key = (String)keys.nextElement();
  		out.println(key + ": " + session.getValue(key) + "<br>");
	}
	%>

	</body>
	</html>