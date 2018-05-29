import javax.servlet.http.*;
import javax.servlet.*;
import java.io.*;
import java.util.*;

public class Paint extends HttpServlet {

	List<String> actions = new ArrayList<String>();

	public void doGet(HttpServletRequest req,HttpServletResponse res) throws IOException
	{
		res.setContentType("text/xml");//setting the content type
		PrintWriter pw = res.getWriter();//get the stream to write the data

		HttpSession s = req.getSession();

		if(req.getParameter("uname")!=null)
			s.setAttribute("uname",req.getParameter("uname"));

		String uname;
		if(s.getAttribute("uname")!=null) uname = s.getAttribute("uname").toString();
		else uname = "Anonymous";

		if(req.getParameter("newmsg")!=null){
			messages.add(uname+": "+req.getParameter("newmsg"));
		}

		if(req.getParameter("clear")!=null){
			messages = new ArrayList<String>();
		}



		pw.println("<picture>");
		for(int i=0; i<messages.size(); i++){
			pw.println("<action>"+messages.get(i)+"</action>");
		}
		pw.println("</picture>");

		pw.close();
	}

	public void doPost(HttpServletRequest req,HttpServletResponse res) throws IOException{
		doGet(req,res);
	}


}
