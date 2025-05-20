import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { Project, ProjectResponse } from '../types';
import { cleanObjectForFirestore, getNestedValue } from '../utils/firebaseHelpers';
import { deleteImageFromStorage, isFirebaseStorageUrl } from '../utils/imageUtils';
import { sampleProjects } from '../utils/sampleData';

/**
 * 프로젝트 데이터를 관리하는 커스텀 훅
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 프로젝트 데이터 가져오기
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const projectsQuery = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(projectsQuery);
      const projectsList: Project[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // 기본 구조 확인 및 초기화
        projectsList.push({
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          techStack: {
            fieldSkill: data.techStack?.fieldSkill || [],
            server: data.techStack?.server || [],
            os: data.techStack?.os || [],
            collaboration: data.techStack?.collaboration || [],
            tools: data.techStack?.tools || [],
            db: data.techStack?.db || []
          },
          contribution: {
            intro: data.contribution?.intro || '',
            period: data.contribution?.period || '',
            members: data.contribution?.members || '',
            keyFeatures: data.contribution?.keyFeatures || [],
            teamAchievement: data.contribution?.teamAchievement || '',
            role: {
              summary: getNestedValue(data, 'contribution.role.summary', ''),
              details: getNestedValue(data, 'contribution.role.details', [])
            }
          },
          apiDesign: {
            auth: data.apiDesign?.auth || [],
            data: data.apiDesign?.data || []
          },
          screenshots: data.screenshots || [],
          order: data.order || 0,
          architecture: {
            image: data.architecture?.image || '',
            description: data.architecture?.description || ''
          }
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
  }, []);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // 프로젝트 추가
  const addProject = async (newProject: Omit<Project, "id">): Promise<ProjectResponse> => {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }

      // 저장 전 데이터 정리 (빈 필드 제거)
      const cleanedProject = cleanObjectForFirestore({
        ...newProject,
        order: projects.length
      });

      const docRef = await addDoc(collection(db, 'projects'), cleanedProject);
      
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
      if (!db) {
        throw new Error('Firestore is not initialized');
      }

      // 저장 전 데이터 정리 (빈 필드 제거)
      const cleanedProject = cleanObjectForFirestore(updatedProject);
      
      await updateDoc(doc(db, 'projects', updatedProject.id), cleanedProject);
      
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

  // 프로젝트 삭제 (이미지도 함께 삭제)
  const deleteProject = async (projectId: string): Promise<ProjectResponse> => {
    try {
      // 프로젝트 찾기
      const projectToDelete = projects.find(p => p.id === projectId);
      if (!projectToDelete) {
        throw new Error('삭제할 프로젝트를 찾을 수 없습니다.');
      }

      // 프로젝트에 포함된 이미지들 Storage에서 삭제
      const deleteImagePromises: Promise<void>[] = [];

      // 1. 스크린샷 이미지 삭제
      if (projectToDelete.screenshots && projectToDelete.screenshots.length > 0) {
        projectToDelete.screenshots.forEach(screenshot => {
          if (screenshot.image && isFirebaseStorageUrl(screenshot.image)) {
            deleteImagePromises.push(deleteImageFromStorage(screenshot.image).then(() => {}));
          }
        });
      }

      // 2. 아키텍처 이미지 삭제
      if (projectToDelete.architecture?.image && isFirebaseStorageUrl(projectToDelete.architecture.image)) {
        deleteImagePromises.push(deleteImageFromStorage(projectToDelete.architecture.image).then(() => {}));
      }

      // 병렬로 이미지 삭제 작업 실행
      if (deleteImagePromises.length > 0) {
        await Promise.allSettled(deleteImagePromises);
      }

      // Firestore에서 프로젝트 문서 삭제
      await deleteDoc(doc(db, 'projects', projectId));
      
      // 상태 업데이트
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      
      return { success: true };
    } catch (err: any) {
      console.error('프로젝트 삭제 오류:', err);
      setError('프로젝트 삭제 중 오류가 발생했습니다.');
      return { success: false, error: err.message };
    }
  };

  // 프로젝트 새로고침
  const refreshProjects = async (): Promise<void> => {
    await fetchProjects();
  };

  return {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects
  };
}