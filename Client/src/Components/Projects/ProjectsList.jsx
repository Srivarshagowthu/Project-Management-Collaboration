import React, { useState, useEffect } from "react";
import axios from "axios";
import { CardContainer } from "../Homepage/AllProjects"; // Assuming CardContainer is exported from AllProjects
import NavigationBar from "../Homepage/Navigationbar";

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [groupedProjects, setGroupedProjects] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/everyproject");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const groupProjectsByOrganization = async () => {
      const groupedProjects = {};
      for (const project of projects) {
        const organizationId = project.organizationId;
        const info = await axios.get(
          `http://localhost:3000/org/getorganizationinfo/${organizationId}`
        );
        if (!groupedProjects[organizationId]) {
          groupedProjects[organizationId] = {
            name: `${info.data.name}'s Organization Projects`, // Assuming your backend provides organizationName
            projects: [],
          };
        }
        groupedProjects[organizationId].projects.push(project);
      }
      setGroupedProjects(groupedProjects);
    };

    if (projects.length > 0) {
      groupProjectsByOrganization();
    }
  }, [projects]);

  const handleConnect = (projectId) => {
    // Handle connect functionality
  };

  return (
    <div>
      <NavigationBar />
      <div className="container mx-auto">
      <h2 className="text-3xl font-bold mt-8 mb-4">All Projects</h2>
      {Object.values(groupedProjects).map((organization, index) => (
        <div key={index}>
          <h3 className="text-xl font-bold mt-4 mb-2">{organization.name}</h3>
          <CardContainer cards={organization.projects} />
        </div>
      ))}
    </div>
    </div>
    
  );
}

export default ProjectsList;
