package utcn.ds.users.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utcn.ds.users.domain.LoginDto;
import utcn.ds.users.domain.LoginResponse;
import utcn.ds.users.domain.Person;
import utcn.ds.users.service.PersonService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(value = "/persons")
@CrossOrigin(origins = "http://localhost:3000")
public class PersonController {
    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @PostMapping
    @Secured("ROLE_ADMIN")
    public Person createPerson(@RequestBody Person person) {
        return personService.createPerson(person);
    }

    @GetMapping("/{id}")
    @Secured("ROLE_ADMIN")
    public Optional<Person> getPersonById(@PathVariable UUID id) {
        return personService.getPersonById(id);
    }

    @GetMapping
    @Secured("ROLE_ADMIN")
    public List<Person> getAllPersons() {
        return personService.getAllPersons();
    }

    @PutMapping("/{id}")
    @Secured("ROLE_ADMIN")
    public Person updatePerson(@PathVariable UUID id, @RequestBody Person updatedPerson, @RequestHeader("Authorization") String authorizationHeader) {
        return personService.updatePerson(id, updatedPerson, authorizationHeader);
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    public void deletePerson(@PathVariable UUID id, @RequestHeader("Authorization") String authorizationHeader) {
        personService.deletePerson(id, authorizationHeader);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDto person) {
        System.out.println(person.getUsername() + " " + person.getPassword());
        String token = personService.login(person);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(token);
    }
}
