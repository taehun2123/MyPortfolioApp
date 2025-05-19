import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Project, ProjectResponse } from '../types';
import { sampleProjects } from '../utils/sampleData';

/**
 * 프로젝트 데이터를 관리하는 커스텀 훅
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 프로젝트 데이터 가져오기
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsQuery = query(collection(db, 'projects'), orderBy('order'));
        const querySnapshot = await getDocs(projectsQuery);
        const projectsList: Project[] = [];
        
        querySnapshot.forEach((doc) => {
          projectsList.push({
            id: doc.id,
            ...(doc.data() as Omit<Project, 'id'>)
          });
        });
        
        setProjects(projectsList.length > 0 ? projectsList : sampleProjects);
      } catch (err: any) {
        console.error('프로젝트 데이터 가져오기 오류:', err);
        setError('프로젝트를 불러오는 중 오류가 발생했습니다.');
        setProjects(sampleProjects);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // 프로젝트 추가
  const addProject = async (newProject: Omit<Project, 'id'>): Promise<ProjectResponse> => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...newProject,
        order: projects.length
      });
      
      const addedProject: Project = { 
        id: docRef.id, 
        ...newProject, 
        order: projects.length 
      };
      
      setProjects([...projects, addedProject]);
      return { success: true, project: addedProject };
    } catch (err: any) {
      console.error('프로젝트 추가 오류:', err);
      setError('프로젝트 추가 중 오류가 발생했습니다.');
      return { success: false, error: err.message };
    }
  };
  
  // 프로젝트 수정
  const updateProject = async (updatedProject: Project): Promise<ProjectResponse> => {
    try {
      await updateDoc(doc(db, 'projects', updatedProject.id), { ...updatedProject });
      
      setProjects(projects.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      ));
      return { success: true, project: updatedProject };
    } catch (err: any) {
      console.error('프로젝트 수정 오류:', err);
      setError('프로젝트 수정 중 오류가 발생했습니다.');
      return { success: false, error: err.message };
    }
  };
  
  // 프로젝트 삭제
  const deleteProject = async (projectId: string): Promise<ProjectResponse> => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      return { success: true };
    } catch (err: any) {
      console.error('프로젝트 삭제 오류:', err);
      setError('프로젝트 삭제 중 오류가 발생했습니다.');
      return { success: false, error: err.message };
    }
  };

  return {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject
  };
}