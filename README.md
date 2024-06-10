# File Uploader Node.js Backend Application

This Node.js backend application provides a robust file upload service, allowing you to upload images and receive a file path that can be accessed over the internet. The project is fully automated using Jenkins with a CI/CD pipeline, utilizing three AWS EC2 instances for Jenkins controller, pipeline execution, and application deployment.

## How to Use This Project

### Step 1: Running the Docker Container

To run this application using Docker, use the following command:

```sh
docker run -e MONGODB_URL="your_mongodb_database_url" -e PORT=your_pot -p your_pot:4000 salindadocker/fileuploder

```
Replace your_mongodb_database_url with the URL of your MongoDB database.
### Step 2: Uploading an Image
To upload an image, send a POST request to the following API endpoint:
```sh
http://{{IP}}:your_pot/api/v1/upload
````
In the request body, share the attribute name image and attach the image file. The response will provide you with details about the uploaded file.

Example Response:
```
{
    "name": "homepage6.webp",
    "filepath": "file/a3c6325b-f54d-452c-a75f-ef4cd5ae302e.webp",
    "size": 70570,
    "_id": "6666b17263e4d1834fd1bc82",
    "__v": 0
}
```
### Step 3: Accessing the Uploaded Image
You can access the uploaded image via the following URL format:
```
http://{{IP}}:your_pot/public/file/b80f8bd0-752d-4bd7-903e-c114b40fd7a2.webp
```
### Step 4: Deleting an Image
To delete an uploaded image, send a DELETE request to the following API endpoint:
```
http://{{IP}}:your_pot/api/v1/delete
```
In the request body, provide the filepath of the image you want to delete.

Example Request Body:
```
{
    "filepath": "file/43e9dd11-7d01-4b26-acf0-bb61d0ab0107.webp"
}
````
### Step 5: Finding a Specific Image
To find a specific image, send a POST request to the following API endpoint:
```
http://{{IP}}:your_pot/api/v1/findOnefile
```
In the request body, provide the filepath of the image you want to find.

Example Request Body:
```
{
    "filepath": "file/43e9dd11-7d01-4b26-acf0-bb61d0ab0107.webp"
}
```


# Project Workflow

## Automation Details

The project uses a full CI/CD pipeline set up with three AWS EC2 instances:


- **Controller Instance**: Runs the Jenkins server.
- **Agent Instance**: Executes the pipeline.
- **Host Instance**: Deploys the application.

## Pipeline Workflow

- **Triggering the Pipeline**: The pipeline is triggered by commits to the main branch in GitHub using a webhook. This ensures that every change is automatically tested and deployed.
- **Running Tests**: The pipeline runs a series of tests to ensure code quality and functionality. This helps catch any issues early in the development process.
- **Building Docker Image**: After successful tests, the pipeline builds a Docker image of the application. Dockerizing the application ensures consistency across different environments and simplifies the deployment process.
- **Pushing Docker Image**: The built Docker image is pushed to Docker Hub and made publicly available. This allows anyone to pull and run the image on their own infrastructure.
- **Deploying Application**: Finally, the Docker image is deployed on the host instance, making the application available for use.

## Technologies Used

- **Node.js**: Provides the backend functionality for handling file uploads.
- **Jenkins**: Automates the CI/CD pipeline, ensuring reliable and efficient deployments.
- **Docker**: Containerizes the application, making it portable and easy to deploy.
- **AWS EC2**: Hosts the Jenkins server, pipeline executor, and deployed application, providing a scalable and reliable infrastructure.
- **MongoDB**: Serves as the database for storing file metadata.

## Benefits

- **Automation**: Fully automated CI/CD pipeline ensures consistent and reliable deployments.
- **Accessibility**: The Docker image is publicly available, making it easy for any project to integrate and use the image uploading service.
- **Scalability**: Utilizing AWS EC2 instances for deployment ensures the application can scale as needed.
