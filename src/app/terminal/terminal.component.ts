import { Component, OnInit } from '@angular/core';
import Typed from 'typed.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {

  prompt: Element = document.querySelector(".prompt")!;
  cursor: Element | null = document.querySelector('.typed-cursor');
  userInput: HTMLElement | null = document.getElementById('user-input');

  data = [
    { 
      action: 'type',
      strings: ["npm install -g portfolio^400"],
      output: '<span class="gray" style="color: gray">+brooks_Portfolio@0.0.1 installed</span><br>&nbsp;',
      postDelay: 500
    },
    { 
      action: 'type',
      strings: ['echo \'Type \"help\" to get started\'^400'],
      // output: '<span class="gray" style="color: gray">Type</span> <span class="magic">"help"</span><span> to get started</span><br>&nbsp;',
      output: '<span class="gray" style="color: gray">Type</span> <span style="color: #CCCC00 !important">"help"</span><span style="color: gray;"> to get started</span><br>&nbsp;',
      postDelay: 1000,
  },
  ];

  constructor(private router: Router) { }

  ngOnInit() {

    // Log initial dimensions of terminalwindow
    console.log("Initial width: " + $('section.terminal').width());
    console.log("Initial width of header: " + $('.terminal-window-header').width());

    this.setUpGreenBtn();

    this.displayOnTerminal(this.data, 0);
  }

  setUpGreenBtn() {
    // Add click listeners to buttons
    $('#green-btn').click(function() {
      console.log("Green button clicked");

      // If the terminal is maximized
      if ($('section.terminal').attr('maximized') === 'true') {
        console.log("Terminal is maximized, so minimize it");

        $('section.terminal').attr('maximized', 'false');

        // Shrink the terminal window 
        $('section.terminal').css('width', '600px');
        $('.terminal-window-header').css('width', '589px');

      } else {

        console.log("Terminal is minimized, so maximize it");

        $('section.terminal').attr('maximized', 'true');

        // Maximize the terminal window
        $('section.terminal').css('width', '800px');
        $('.terminal-window-header').css('width', '790px');
      }

      console.log("Attribute value: " + $('section.terminal').attr('maximized'));
    });
  }

  displayOnTerminal(data: any[], pos: number) {
    // Disable the input
    $('#user-input').prop('disabled', true);
    $('#user-input').css('opacity', '0');

    // script is the current object in the data array
    var script = data[pos];

    // If clear is set to true, clear the terminal
    if (script.clear === true) {
      $('.history').html('');
    }

    // Detect the action to perform
    switch(script.action) {
      case 'type':

        $('.typed-cursor').text('');

        // Type the message
        new Typed('.prompt', {
          strings: script.strings,
          typeSpeed: script.typeSpeed ?? 50,
          backSpeed: 20,
          smartBackspace: true,
          onComplete: () => {

            // Grab the history
            var historyElem = $('.history').html();
            
            var history = historyElem ? [historyElem] : [];

            console.log("Logging: " + '$ ' + $('.prompt').html());
            history.push('$ ' + $('.prompt').html());

            if (script.output) {
              history.push(script.output);
              $('.prompt').html('');
              $('.history').html(history.join('<br>'));
            }

            // scroll to bottom of screen\
            var screenHeight: number = $('section.terminal').height()!;
            $('section.terminal').scrollTop(screenHeight);

            // Run next script
            pos++;

            if(pos < data.length) {
              // Wait 1 sec and then display the next script
              setTimeout(() => {
                this.displayOnTerminal(data, pos);
              }, script.postDelay || 1000);
              
            } else {
              console.log("End of data array"); 
              
              // TODO: Let user type in the terminal
              enterUserInputMode();
            }
          }
        })
      
        break;
    }
  }
}

function enterUserInputMode() {
  console.log("Entering user input mode");

  // Enable the input
  $('#user-input').prop('disabled', false);
  $('#user-input').css('opacity', '1');

  let input = document.querySelector('#user-input')! as HTMLInputElement;
  let cursor = document.querySelector('.typed-cursor')! as HTMLElement;

  function adjustInputWidth() {
    // const input = document.querySelector('#user-input') as HTMLInputElement;
    input.style.width = input.value.length > 0 ? `${input.value.length}ch` : '0px';

    // Increase width of input by 1px
    input.style.width = `${input.offsetWidth + 1}px`;
  }

  input.addEventListener('input', (event) => {
    adjustInputWidth();
  });

  $('#user-input').focus();

  // Hide the cursor
  $('.typed-cursor').css('opacity', '0');

  // Set the width of the input to 0px
  $('#user-input').css('width', '0px');

  // Add a click listener to terminal window
  $('section.terminal').click(function() {
    // Shift focus to the input with id 'user-input'
    $('#user-input').focus();
  });

  // Add an event listener to the input for any keypress
  $('#user-input').keypress(function(e) {
    // console.log("Key pressed: " + e.which);

    // If ENTER is pressed
    if (e.which == 13) {
        console.log("ENTER pressed");

        // Get the value of the input
        submitCommand($('#user-input').val() as string);
    }
  });
}

function submitCommand(command: string) {
  console.log("Running command: " + command);

  // If $(.history).html() ends in two <br> tags, remove one of them.
  if ($('.history').html()!.endsWith('<br><br>')) {
    $('.history').html($('.history').html()!.slice(0, -4));
  }

  // Grab the history
  var historyElem = $('.history').html();          
  var history = historyElem ? [historyElem] : [];

  // Search the hisotry for any 2 consecutive <br> tags
  var index = historyElem?.search('<br><br>');
  if (index != -1) {
    console.log("Found two consecutive <br> tags");

    console.log("History before: " + historyElem);

    // Remove the first <br> tag
    historyElem = historyElem?.replace('<br><br>', '<br>');
    history = [historyElem!];

    console.log("Setting history to: " + historyElem);

    // Set the history
    $('.history').html(historyElem!);
  }

  // Logging the command
  console.log("Logging: " + '$ ' + command);
  history.push('$ ' + command);

  // Clear the prompt
  $('.prompt').html('');

  if (command == "ls") {
    // Handle output
    var output = '<span style="color: gray">About<br>Education<br>Experience<br>Projects<br>Skills<br>Contact</span>';
    history.push(output);
    history.push("<br>");
    

  } else if (command == "clear") {
    history = [];

  } else if (command == "help" || command == '\"help\"') {
    // var output = '<span style="color: gray">Glad you asked.<br><br>&#215; You can type "ls" to see the available page sections.<br>&#215; Typing "cd" followed by a section name will take you there!<br>&#215; If the terminal gets crowded, just type "clear".<br>&#215; For a list of all commands, type "commands".<br><br>Or you can just navigate the website manually, I guess. See you around!</span>';
    var output = '<span style="color: gray">Glad you asked.<br><br>&#215; You can type </span><span style="color: #CCCC00 !important;">"ls"</span><span style="color: gray"> to see the available page sections.<br>&#215; Typing </span><span style="color: #CCCC00 !important;">"cd"</span><span style="color: gray;"> followed by a section name will take you there!<br>&#215; If the terminal gets crowded, just type </span><span style="color: #CCCC00 !important;">"clear"</span><span style="color: gray;">.<br>&#215; For a list of all commands, type </span><span style="color: #CCCC00 !important;">"commands"</span><span style="color: gray">.<br><br>Or you can just navigate the website manually, I guess. See you around!</span>';
    history.push(output);
    history.push("<br>");
  
  } else if (command == "commands") {
    var output = '<span style="color: gray">&#215; <span/><span style="color: rgb(244, 143, 177) !important;">ls</span><span style="color: gray"><br>&#215; </span><span style="color: rgb(244, 143, 177) !important;">cd</span><span style="color: gray"><br>&#215; </span><span style="color: rgb(244, 143, 177) !important;">clear</span><span style="color: gray"><br>&#215; </span><span style="color: rgb(244, 143, 177) !important;">help</span>';
    history.push(output);
    history.push("<br>");

  } else if (command.split(" ")[0] == "cd") {
    console.log("CD command detected");
    var section_name: string = command.split(" ")[1];
    console.log("Section name: " + section_name);

    if (section_name == 'Home' || section_name == 'About' || section_name == 'Education' || section_name == 'Experience' || section_name == 'Projects' || section_name == 'Skills' || section_name == 'Contact'){
      var output = processSectionName(section_name);
      history.push(output);
      history.push("<br>");
    }
  
    if (!section_name) {
      console.log("No section name provided");
      var output = `<span style="color: rgba(214, 13, 13, 0.722);">Usage: cd {section}</span>`;
      history.push(output);
      history.push("<br>");
      
    } 
    // If section name is not one of the available sections
    else if (["Home", "About", "Education", "Experience", "Projects", "Skills", "Contact"].indexOf(section_name) == -1) {
      var output = `<span style="color: rgba(214, 13, 13, 0.722);">cd: no such section: ${section_name}</span>`;
      history.push(output);
      history.push("<br>");
    }
  } else {
    // Handle output
    let first_word = command.split(' ')[0];
    var output = `<span style="color: rgba(214, 13, 13, 0.722);">Command not found: ${first_word}</span>`;
    history.push(output);
    history.push("<br>");
    
  }

  // Update the history
  $('.history').html(history.join('<br>'));

  // Scroll to the bottom of the screen
  $('section.terminal').scrollTop($('section.terminal').height() as number);

  // Clear the input
  $('#user-input').val('');

  // Scroll to the bottom of the screen
  $('section.terminal').scrollTop($('.history').height() as number);

  // Shift focus to the input with id 'user-input'
  $('#user-input').focus();

  // Update width of input
  $('#user-input').css('width', '0px');


}  

function processSectionName(section_name: string): string {
    // Process the section_name here
    // This is just a placeholder. Replace this with your actual processing code.
    
    let processed_section_name = section_name.toUpperCase();

    if (section_name == 'About') {
      let output = '<span style="color: white">Hey there! My name is Joseph!' + '<br> <br>' +'My friends call me Sam. I am a software engineer based in Grosse Pointe Farms, Michigan.</span>' + '<br> <br>'+'<span style=" color: white"> I am most familiar with Angular, Ionic and node JS to make applications in a productive manner.</span><br><br>' + '<span style="color: white">I am passionate about security, and networks but also full-stack web development! and I am always looking for opportunities to learn and grow. </span>';
      return output;
    }
    
    if (section_name == 'Education'){
      let output='<span style="color: white">I graduated from Wayne State University in December of 2023, pursuing a Bachelor of Science in Computer Science.' +'<br>'+ 'For High-School I went to Grosse Pointe South and graduated in 2019!' + '</span>';
      return output;
    }

    if (section_name == 'Experience'){
      let output='<span style="color: white"> <br> I am currently open for work!' +'<br> <br>' +'Although over the past few years I have been working at a powdercoating company I founded myself, called, JSB Coatings. I have grown this company for the better part of 2 years now and I am loving it!' + '<br><br>' + 'Blue Cross Blue Shield of Michigan - I served as an executive services intern, this role consisted of shadowing a project coordinator for the appeals and grievances department. My duties were to configure KPI widgets as well as creating audit reports for the years 2020 and 2021 to align with government compliance.' +'</span>';
      return output;
    }
    
    if (section_name == 'Projects'){
      let output='<span style="color: white">A few projects that I am proud of, but the one I am most proud of is my portfolio website! I built it from scratch using Angular and Ionic. I also have a few other projects that I have worked on, such as web applications and a mobile application. I am always looking for new projects to work on, so if you have any ideas, feel free to reach out to me!' + '<br><br>' + 'I helped lead and develop a web-based application called Go-Mechanic, for users to connect with mobile mechanics and chat with them for potential repairs. This was built using Angular and Firebase! '+ '<br><br>' + 'At Wayne State, I had taken the role as team lead for a capstone project. This role had given me exposure to technologies such as .NET core, Azure, and Rasa. I had developed the front facing UI for this mobile sale analytics application and introduce a conversational chatbot to retrieve sales and fequently asked questions. ' + '</span>';
      return output;
    }

    if (section_name == 'Skills'){
      let output='<span style="color: white">The languages I currently use include, C/C++, Java, Python, JavaScript, TypeScript, HTML, CSS' + '<br><br>' + 'Cloud/Databases that I am familiar with are MSSQL, Azure, Firebase, AWS' + '<br><br>' + 'I use several linux distributions/operating systems, such as kali to develop this application! but I am most familiar with Windows.'+ '</span>';
      return output;
    }

    if (section_name == 'Contact'){
      let output='<span style="color: white">You can reach me at my email: josephbrooks000@gmail.com... I am also on ' + '<a href="https://www.linkedin.com/in/joseph-brooks-a5487b1b7?trk=people-guest_people_search-card"> LinkedIn </a>' + ' so feel free to connect with me there! </span>';
      return output;
    }
    
    // Prepare the output
    let output = `<span style="color: grey;">Processed section name: ${processed_section_name}</span>`;
  
    return output;
  }