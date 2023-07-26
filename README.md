# PROGRESSIO
A place to organize and share progress in any hobby or activity.

**Link to project:** http://progress.cyclic.app

<!-- ![alt tag](http://placecorgi.com/1200/650) -->

## Tools Used:
HTML5, CSS3, JavaScript, MongoDB, Mongoose, Passport, EJS, Express, Multer, Node.JS 

## How It's Made:

The goal of this platform is to provide a space where you can organize and reflect on your growth, with the added benefit of being able to share your progress with others who are interested in following those journeys. This platform allows you to create an account, enabling you to manage your profile, create progress reels, and capture your progress within those reels. During the signup process, you are required to provide unique usernames and emails, but you can sign in using the email address used on signup. Additionally, users can follow one another and view their followers.

## Organizing your progress with the Progress Reel

To start, after creating an account, first you would need to create a reel, which can be seen as a folder for your progress. To do so, navigate to your profile page, then click the "create reel" button on the left hand side (desktop) or at the top of the page (mobile). From there, a popup will appear where you can provide a title for your interest or hobby, as well as a brief description of the reel.

## Edit User Profile

To edit your profile, simply navigate to your profile page and click the edit profile button. After clicking the button, you can change your displayed name, change your profile description, add a external link and change your profile picture. Usernames and Emails are considered to be unique, thus cannot be changed at this point in time. Profiles can be made private so users that aren't following you won't be able to see your posts

## Info about your Captures

A capture can be represented as the point in your progress. Captures, or posts, are stored within individual reels, and can be accessed either by the feed, or the reel view. The platform calculates the total number of likes for every capture within a reel and displays it next to the reel name.

Within each post, users can add comments to those captures. Posts can either be an image upload, a plain text upload, or a link upload. All captures are formatted to be responsive for a large majority of devices.

## Social and the Feed

Within the feed, you can see all captures only made by people you currently follow, as well as your posts. From there you can like and comment on posts. Also within the feed, you can search for your own hobbies or interests to find captures and reels made by other people with those same hobbies or interests. If nothing found, why not start it?

## Visibility

Being able to find the progress of others to act as a reference for your own journey is one of the many goals I wanted to reach with this project, but I do understand some may not want their progress to be shared to the world. So to help overcome that, users can hide their profile and progress from public view, where only friends can see the progress. This option has also been extended to individual progress reels, so incase you want a public account but with specific private reels, that is also possible.

## Optimizations:

Many optimizations have been made throughout the course of development, most notably being the switch from arrays to objects. The feed page had multiple `includes()` array methods nested within eachother. This caused the worst-case render-time, for the page featuring the most data, to be `O(n^3)`, where `n` is the number of posts. Switching from an array to an object to store data gave me the ability to look up properties in the object in constant time, effectively making the worse-case runtime simply be `O(n)` rather than `O(n^3)`, reducing the process down to a single loop. Although it's still not ideal, it is far better than what was implemented before.

This project uses the MVC architecture for better separation of concerns and simplicity for working on a full-stack social media web application. Conversion to JSX for rendering and Typescript is something I want to do, as from my understanding of those tools, they will help me greatly improve the UI/UX aspect of the site as well as helping in designing the back-end to scale properly.

Also, due to size limitations with cyclic and the enormous file size of the dependency, "puppeteer", I was forced to remove the implementation I had to generate link previews. I found a free API that did what I was looking for, but it didn't work as well as my previous implementation. So I then made my own API that could generate the link previews using my previous method, which I then called from the website to send me the information I needed for links. It worked perfectly except I struggled way too long with a CORS error and went with an API that someone else had made, and now use placeholder data incase data returns undefined from the API call. Though, I am still actively working on resolving the error.

Additionally, I was able to rewrite the styling from CSS3 to Tailwind, for easier modification to the project and to improve reusability. The entire project was previously entirely styled using CSS3, but Tailwind's ease-of-use was very persuasive in the decision to switch.

## Notice:

This website and project is a demonstration and a proof-of-concept. The new, updated site can be accessed [here](https://evolvr.ink)

## Examples:
Take a look at these couple examples that I have in my own portfolio:

**NASA APOD:** https://github.com/boonaki/nasaAPODapp

**Tea API:** https://github.com/boonaki/boonakis-tea-api

**Portfolio:** https://github.com/boonaki/PortfolioV2
