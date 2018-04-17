import java.sql.*;

class ConnectionHandler {

    private String user = "";
    private String password = "";

    ConnectionHandler(String user, String password){
        if (user != null)
            this.user = user;

        if (password != null)
            this.password = password;

    }

    public Connection connect() throws ClassNotFoundException {
        Class.forName("org.postgresql.Driver");
        Connection conn = null;
        try {
            String url = "jdbc:postgresql://51.255.172.150/tikoht";
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connected to the PostgreSQL server successfully.");
        } catch (Exception e) {
            System.out.println(e);
        }

        return conn;
    }

    public boolean insert(Connection connection, String input){
        Statement stmt = null;
        try{
            stmt = connection.createStatement();
            stmt.executeUpdate(input);
            stmt.close();
        } catch ( Exception e ) {
            System.err.println(e);
            return false;
        }
        System.out.println("Table created successfully");
        return true;
        }

    public ResultSet select (Connection connection, String selectCommand, String input) throws SQLException {
        try{
            Statement stmt = connection.createStatement();
            ResultSet resultSet = stmt.executeQuery(selectCommand);
            return resultSet;
        } catch (Exception e) {
            System.err.println(e);
            throw new SQLException("Could not return result set!");
        }
    }

    public void closeConnection(Connection connection){
        try{
            connection.close();
        } catch (Exception e){
            System.err.println("Error while closing connection.");
        }
    }
}
