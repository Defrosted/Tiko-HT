package database;

import datamodel.User;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;

public class UserHandler {
    private SessionFactory sessionFactory;

    public UserHandler() {
        sessionFactory = new HibernateConfiguration().getConfiguration().configure().buildSessionFactory();
    }

    public UserHandler(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public User getUserById(int id) throws Exception {
        Session session = sessionFactory.getCurrentSession();

        try {
            session.beginTransaction();
            User user = (User) session.get(User.class, id);

            session.getTransaction().commit();

            return user;
        } catch (HibernateException e) {
            session.getTransaction().rollback();
            throw new Exception("Failed to get user by id: " + e.getMessage());
        }
    }

    public int addUser(User user) throws Exception {
        Session session = sessionFactory.getCurrentSession();

        try {
            session.beginTransaction();
            Query query = session.createQuery("from User where email=:email");
            query.setParameter("email", user.getEmail());

            int userId = -1;
            if(query.uniqueResult() == null) {
                userId = (Integer) session.save(user);
            } else {
                throw new Exception("User already exists.");
            }

            session.getTransaction().commit();

            return userId;
        } catch (HibernateException e) {
            session.getTransaction().rollback();
            throw new Exception("Adding new user failed: " + e.getMessage());
        }
    }
}
