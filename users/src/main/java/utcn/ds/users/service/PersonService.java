package utcn.ds.users.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import utcn.ds.users.domain.LoginDto;
import utcn.ds.users.domain.LoginResponse;
import utcn.ds.users.domain.Person;

import utcn.ds.users.repository.PersonRepository;
import utcn.ds.users.security.JwtUtil;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PersonService {
    private final PersonRepository personRepository;
    private final RestTemplate restTemplate;


    @Autowired
    public PersonService(PersonRepository personRepository, RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.personRepository = personRepository;
    }

    public Person createPerson(Person person) {
        if(personRepository.findByUsername(person.getUsername()).isPresent()) {
            throw new RuntimeException("Person already exists!");
        }
        return personRepository.save(person);
    }

    public Optional<Person> getPersonById(UUID id) {
        return personRepository.findById(id);
    }


    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    public Person updatePerson(UUID id, Person updatedPerson, String authorizationHeader) {
        Optional<Person> existingPerson = personRepository.findById(id);
        System.out.println("Existing person: " + existingPerson);
        if (existingPerson.isPresent()) {
            System.out.println("asdasd");
            updateDevices(existingPerson.get().getUsername(), updatedPerson.getUsername(), authorizationHeader);
            System.out.println("fdfsf");
            updatedPerson.setId(existingPerson.get().getId());
            personRepository.deleteById(id);
            System.out.println("dsada");
            return personRepository.save(updatedPerson);
        }
        return null;
    }

    public void deletePerson(UUID id, String authorizationHeader) {
        Optional<Person> existingPerson = personRepository.findById(id);
        if (existingPerson.isPresent()) {
            personRepository.deleteById(id);
            updateDevices(existingPerson.get().getUsername(), authorizationHeader);
        }
    }

    public String login(LoginDto person) {
        Optional<Person> existingPerson = personRepository.findByUsername(person.getUsername());

        if (existingPerson.isPresent()) {
            System.out.println("Da");
            if (person.getPassword().equals(existingPerson.get().getPassword())) {
                return JwtUtil.generateToken(existingPerson.get().getUsername(), existingPerson.get().getRole().toString());
            }
        }
        return null;
    }

    private void updateDevices(String username, String authorizationHeader) {
        String url = "http://172.16.200.11:8081/devices/updatePersonUsernameToEmpty/" + username;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        System.out.println("Authorization header: " + authorizationHeader);
        headers.set("Authorization", authorizationHeader);
        HttpEntity<Object> request = new HttpEntity<>(null, headers);
        restTemplate.exchange(url, HttpMethod.PUT, request, Void.class);

    }

    private void updateDevices(String username, String newUsername, String authorizationHeader) {
        String url = "http://172.16.200.11:8081/devices/updatePersonUsernameToNew/" + username + "/" + newUsername;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        System.out.println("Authorization header: " + authorizationHeader);
        headers.set("Authorization", authorizationHeader);
        HttpEntity<Object> request = new HttpEntity<>(null, headers);
        restTemplate.exchange(url, HttpMethod.PUT, request, Void.class);

    }

}
