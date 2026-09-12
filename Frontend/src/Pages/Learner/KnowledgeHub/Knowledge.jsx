// src/Pages/Learner/Knowledge/Knowledge.jsx

import React, { useState } from "react";

import KnowledgeHeader from "../../../Components/Learner/Knowledge/KnowledgeHeader/KnowledgeHeader";

import KnowledgeSearch from "../../../Components/Learner/Knowledge/KnowledgeSearch/KnowledgeSearch";

import KnowledgeResources from "../../../Components/Learner/Knowledge/KnowledgeResources/KnowledgeResources";

import KnowledgeClosing from "../../../Components/Learner/Knowledge/KnowledgeClosing/KnowledgeClosing";

import "./Knowledge.css";

/* =========================================================
   DEFAULT KNOWLEDGE FILTERS
========================================================= */

const DEFAULT_FILTERS = {
  query: "",
  resourceType: "All Resources",
  category: "All Categories",
  sortBy: "Most Relevant",
  level: "All Levels",
  duration: "Any Duration",
};

/* =========================================================
   KNOWLEDGE PAGE
   Capacity Connect — Learner Knowledge Hub

   CURRENT STRUCTURE:

   ✓ Knowledge Header
   ✓ Knowledge Search
   ✓ Knowledge Resources
   ✓ Knowledge Closing

   FILTER FLOW:

   KnowledgeSearch
        ↓
   Knowledge.jsx
        ↓
   knowledgeFilters
        ↓
   KnowledgeResources
        ↓
   Filtered resources
========================================================= */

import { useNavigate } from "react-router-dom";

const Knowledge = () => {
  const navigate = useNavigate();

  const [knowledgeFilters, setKnowledgeFilters] = useState(DEFAULT_FILTERS);

  const handleExploreRecommendations = () => {
    navigate("/learner/recommendations");
  };

  /* =======================================================
     SEARCH ACTION

     Called when the learner performs a search.

     Example:

     {
       query: "ocean",
       resourceType: "Articles"
     }
  ======================================================= */

  const handleSearch = (filters) => {
    setKnowledgeFilters((previousFilters) => ({
      ...previousFilters,
      ...filters,
    }));

    console.log("Search Knowledge:", filters);
  };

  /* =======================================================
     FILTER CHANGE ACTION

     Used for live changes such as:

     ✓ Resource type
     ✓ Search input
     ✓ Category
     ✓ Level
     ✓ Duration
     ✓ Sort
  ======================================================= */

  const handleFilterChange = (filters) => {
    setKnowledgeFilters((previousFilters) => ({
      ...previousFilters,
      ...filters,
    }));
  };

  /* =======================================================
     POPULAR RESOURCE ACTION

     Popular cards can send filters such as:

     {
       query: "productivity",
       resourceType: "All Resources"
     }
  ======================================================= */

  const handlePopularSelect = (filters) => {
    setKnowledgeFilters((previousFilters) => ({
      ...previousFilters,
      ...filters,
    }));

    console.log("Popular Knowledge topic selected:", filters);
  };

  /* =======================================================
     CATEGORY ACTION

     Category cards can send:

     {
       category: "Ocean Science"
     }
  ======================================================= */

  const handleCategorySelect = (filters) => {
    setKnowledgeFilters((previousFilters) => ({
      ...previousFilters,
      ...filters,
    }));

    console.log("Knowledge category selected:", filters);
  };

  /* =======================================================
     VIEW ALL CATEGORIES

     Removes only the category restriction.

     Other filters remain untouched.
  ======================================================= */

  const handleViewAllCategories = () => {
    setKnowledgeFilters((previousFilters) => ({
      ...previousFilters,
      category: "All Categories",
    }));

    console.log("Viewing all Knowledge categories");
  };

  /* =======================================================
     RESOURCE SELECT ACTION
  ======================================================= */

  const handleResourceSelect = (resource) => {
    console.log("Knowledge resource selected:", resource);

    /*
      Later, when Resource Details is created,
      this can become:

      navigate(
        `/learner/knowledge-hub/${resource.id}`
      );
    */
  };

  /* =======================================================
     VIEW ALL RESOURCES

     Completely resets all Knowledge filters.
  ======================================================= */

  const handleViewAllResources = () => {
    setKnowledgeFilters(DEFAULT_FILTERS);

    console.log("Viewing all Knowledge resources");
  };

  /* =======================================================
     EXPLORE MORE RESOURCES

     Used by the final KnowledgeClosing CTA.

     Currently this resets the Knowledge Library to its
     default state so the learner can start exploring again.
  ======================================================= */

  const handleExploreResources = () => {
    setKnowledgeFilters(DEFAULT_FILTERS);

    console.log("Explore more Knowledge resources");
  };

  /* =======================================================
     CLOSING ACTION

     Handles the four action cards inside KnowledgeClosing.

     This is kept API-ready so individual actions can later
     navigate to specific Knowledge Hub features.
  ======================================================= */

  const handleClosingActionSelect = (action) => {
    console.log("Knowledge closing action selected:", action);

    /*
      Future examples:

      if (action.id === "explore") {
        setKnowledgeFilters(DEFAULT_FILTERS);
      }

      if (action.id === "skills") {
        navigate("/learner/my-skills");
      }

      if (action.id === "community") {
        navigate("/learner/community");
      }

      if (action.id === "impact") {
        navigate("/learner/projects");
      }
    */
  };

  return (
    <main className="knowledge-page">
      <div className="knowledge-page__container">
        {/* =================================================
            KNOWLEDGE HEADER
        ================================================= */}

        <KnowledgeHeader
          onExploreRecommendations={handleExploreRecommendations}
        />

        {/* =================================================
            KNOWLEDGE SEARCH

            Search and category actions update the
            knowledgeFilters state above.
        ================================================= */}

        <KnowledgeSearch
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onPopularSelect={handlePopularSelect}
          onCategorySelect={handleCategorySelect}
          onViewAllCategories={handleViewAllCategories}
        />

        {/* =================================================
            KNOWLEDGE RESOURCES

            Receives the current filters and displays
            the matching resources.
        ================================================= */}

        <KnowledgeResources
          filters={knowledgeFilters}
          onFilterChange={handleFilterChange}
          onResourceSelect={handleResourceSelect}
          onViewAllResources={handleViewAllResources}
        />

        {/* =================================================
            KNOWLEDGE CLOSING

            Final section of the Knowledge Hub.

            Contains:

            ✓ Keep Exploring
            ✓ Continue Your Learning Journey
            ✓ Quote
            ✓ Ocean / lighthouse visual
            ✓ Four learning action cards
            ✓ Trusted Knowledge
            ✓ Real-World Relevance
            ✓ Sustainable Future
            ✓ Explore More Resources CTA
        ================================================= */}

        <KnowledgeClosing
          onExploreResources={handleExploreResources}
          onActionSelect={handleClosingActionSelect}
        />
      </div>
    </main>
  );
};

export default Knowledge;
